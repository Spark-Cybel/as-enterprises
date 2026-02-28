// scrape_agm_products.ts
import axios, { type AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { fileURLToPath } from 'url';

//
// TYPES
//
interface ProductDetail {
  key: string;
  value: string;
}

interface ScrapedProduct {
  name: string | null;
  slug: string | null;
  category: string | null;
  image: string | null;
  description: string | null;
  details: ProductDetail[];
}

interface ListingParseResult {
  productLinks: string[];
  pageLinks: string[];
}

//
// CONFIG
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_URL = 'https://agmenterprises.co.in/products/';
const OUTPUT_DIR = path.resolve(__dirname, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');
const CONCURRENCY = 5;
const REQUEST_TIMEOUT = 20000;
const USER_AGENT = 'AGM-MigrationBot/1.0 (+your-email@example.com)';

mkdirp.sync(OUTPUT_DIR);

const axiosInst: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: { 'User-Agent': USER_AGENT }
});

function absUrl(base: string, href: string | undefined): string | null {
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchHtml(url: string, retries = MAX_RETRIES): Promise<string> {
  try {
    const res = await axiosInst.get<string>(url);
    return res.data;
  } catch (err) {
    const error = err as { response?: { status: number }; message: string };
    const status = error.response?.status;
    
    // Retry on 503 (Service Unavailable) or 429 (Too Many Requests)
    if ((status === 503 || status === 429) && retries > 0) {
      const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1); // Exponential backoff
      console.log(`  ↳ Got ${status}, retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return fetchHtml(url, retries - 1);
    }
    
    throw err;
  }
}

// --- Parse details from description HTML
function parseDetailsFromHtml(html: string | null): { details: ProductDetail[]; description: string | null } {
  if (!html) return { details: [], description: null };

  const $ = cheerio.load(html);
  const details: ProductDetail[] = [];

  // Extract key-value pairs from <li> elements
  $('li').each((_i, el) => {
    const text = $(el).text().trim();
    if (!text) return;

    // Split on first colon to get key: value
    const colonIndex = text.indexOf(':');
    if (colonIndex > 0) {
      const key = text.substring(0, colonIndex).trim();
      const value = text.substring(colonIndex + 1).trim();
      if (key && value) {
        details.push({ key, value });
      }
    }
  });

  // Check if there's any prose description (text outside of the details list)
  // Remove "Products Details:" header and list items to see if anything remains
  const fullText = $('body').text().trim() || $.root().text().trim();
  const cleanedText = fullText
    .replace(/Products Details:?/gi, '')
    .replace(/\n+/g, ' ')
    .trim();

  // If the remaining text is just the key-value pairs joined, there's no real description
  const detailsText = details.map(d => `${d.key} ${d.value}`).join(' ');
  const hasProseDescription = cleanedText.length > 0 && 
    cleanedText.replace(/[:\s]/g, '') !== detailsText.replace(/[:\s]/g, '');

  return {
    details,
    description: hasProseDescription ? null : null // Set to null - these products only have structured details
  };
}

// --- Listing page parsing: discover product links and pagination links
function parseListingPage(html: string, pageUrl: string): ListingParseResult {
  const $ = cheerio.load(html);

  // product links heuristics: links that include '/product/'
  const productLinks = new Set<string>();
  $('a[href]').each((_i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (/\/product\/[a-z0-9\-]+\/?/i.test(href)) {
      const a = absUrl(pageUrl, href);
      if (a) productLinks.add(a.split('#')[0]);
    }
  });

  // pagination links heuristics: query param e-page-... or "page" in href
  const pageLinks = new Set<string>();
  $('a[href]').each((_i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    // match e-page- or typical ?page= or /page/ pattern
    if (/e-page-|[?&]page=|\/page\/\d+/i.test(href)) {
      const a = absUrl(pageUrl, href);
      if (a) pageLinks.add(a.split('#')[0]);
    }
  });

  return { productLinks: Array.from(productLinks), pageLinks: Array.from(pageLinks) };
}

// --- Product page parser (adaptable selectors)
function parseProductPage(html: string, url: string): ScrapedProduct {
  const $ = cheerio.load(html);

  // Product name from h1
  const name = $('h1.product_title, h1.entry-title, h1').first().text().trim() || null;

  // Extract image from og:image meta tag (most reliable source)
  let image: string | null = $('meta[property="og:image"]').attr('content') || null;
  
  // Fallback: try JSON-LD schema
  if (!image) {
    try {
      const schemaScript = $('script.yoast-schema-graph').html();
      if (schemaScript) {
        const schema = JSON.parse(schemaScript);
        const imageObj = schema['@graph']?.find((item: { '@type': string }) => item['@type'] === 'ImageObject');
        if (imageObj?.url) {
          image = imageObj.url;
        }
      }
    } catch {
      // JSON parse failed, continue without image
    }
  }

  // Get first category (skip breadcrumb items like "Home", "Shop")
  let category: string | null = null;
  $('.posted_in a, .product_meta .posted_in a').each((_i, el) => {
    const t = $(el).text().trim();
    if (t && !category) {
      category = t;
    }
  });

  // Parse description HTML for structured details
  const descriptionHtml =
    $('.woocommerce-product-details__short-description').first().html()
    || $('.product-description').first().html()
    || null;

  const { details, description } = parseDetailsFromHtml(descriptionHtml);

  // Extract slug from URL
  let slug: string | null = null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    slug = parts.length ? parts[parts.length - 1] : null;
  } catch {
    slug = null;
  }

  return {
    name,
    slug,
    category,
    image,
    description,
    details
  };
}

// --- Crawler
async function main(): Promise<void> {
  const toVisitListPages = new Set<string>([START_URL]);
  const visitedListPages = new Set<string>();
  const discoveredProductUrls = new Set<string>();
  const productData: ScrapedProduct[] = [];
  const limit = pLimit(CONCURRENCY);

  console.log('Starting crawl from', START_URL);

  // discover all listing pages (BFS)
  while (toVisitListPages.size) {
    const next = Array.from(toVisitListPages)[0];
    toVisitListPages.delete(next);
    if (visitedListPages.has(next)) continue;

    console.log('Fetching listing page:', next);
    let html: string;
    try {
      html = await fetchHtml(next);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to fetch listing page', next, error.message);
      visitedListPages.add(next);
      continue;
    }

    const { productLinks, pageLinks } = parseListingPage(html, next);
    productLinks.forEach(u => discoveredProductUrls.add(u));
    pageLinks.forEach(u => {
      if (!visitedListPages.has(u)) toVisitListPages.add(u);
    });

    visitedListPages.add(next);
    // safety: stop if pages explode; you can tune this
    if (visitedListPages.size > 200) break;
  }

  console.log('Discovered product URLs:', discoveredProductUrls.size);

  // fetch product pages with concurrency
  const productUrls = Array.from(discoveredProductUrls);
  await Promise.all(productUrls.map(u => limit(async () => {
    try {
      console.log('Fetching product:', u);
      const html = await fetchHtml(u);
      const parsed = parseProductPage(html, u);
      productData.push(parsed);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching product', u, error.message);
    }
  })));

  // save JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(productData, null, 2), 'utf8');
  console.log(`Saved ${productData.length} products to ${OUTPUT_FILE}`);
}

main().catch(console.error);
