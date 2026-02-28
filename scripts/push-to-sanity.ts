// push-to-sanity.ts
// Migrates scraped product data to Sanity CMS

import { createClient, type SanityClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as dotenv from "dotenv";
import readline from 'readline';

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

interface SanityDetail {
  _key: string;
  key: string;
  value: string;
}

//
// CONFIG
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DATA_FILE = path.resolve(__dirname, 'data/products.json');
const CONCURRENCY = 3; // For image uploads
const DRY_RUN = process.argv.includes('--dry-run');

// Sanity client for mutations
const sanityClient: SanityClient = createClient({
  projectId: 'g3xfk7os',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.VITE_SANITY_API_TOKEN,
});

//
// HELPERS
//
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function confirm(message: string): Promise<boolean> {
  if (DRY_RUN) return true;
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const error = err as { response?: { status: number }; message: string };
    const status = error.response?.status;
    
    // Retry on network/server errors
    const isRetryable = !status || status >= 500 || status === 429;
    
    if (isRetryable && retries > 0) {
      const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
      console.log(`    ↳ ${context} failed, retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return withRetry(fn, context, retries - 1);
    }
    
    throw err;
  }
}

//
// SANITY OPERATIONS
//

// Archive all documents of a type by prefixing names and slugs with "old_"
async function archiveAllOfType(type: string): Promise<number> {
  // Fetch all documents (only those not already prefixed with "old_")
  const docs = await sanityClient.fetch<Array<{ _id: string; name: string; slug: { current: string } }>>(
    `*[_type == "${type}" && !(name match "old_*")]{ _id, name, slug }`
  );

  if (docs.length === 0) {
    console.log(`  No ${type} documents to archive`);
    return 0;
  }

  // Show what will be archived
  console.log(`  Found ${docs.length} ${type} documents to archive:`);
  docs.forEach(doc => {
    console.log(`    - ${doc.name} (${doc.slug?.current || 'no-slug'}) → old_${doc.slug?.current || 'no-slug'}`);
  });

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would archive ${docs.length} ${type} documents (prefix name and slug with "old_")`);
    return docs.length;
  }

  // Update in batches of 100
  const batchSize = 100;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const transaction = sanityClient.transaction();
    batch.forEach(doc => {
      const newSlug = doc.slug?.current ? `old_${doc.slug.current}` : null;
      transaction.patch(doc._id, {
        set: { 
          name: `old_${doc.name}`,
          ...(newSlug && { slug: { _type: 'slug', current: newSlug } })
        }
      });
    });
    await transaction.commit();
    console.log(`  Archived ${Math.min(i + batchSize, docs.length)}/${docs.length} ${type} documents`);
  }

  return docs.length;
}

// Download image and upload to Sanity
async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    // Download with retry
    const response = await withRetry(
      () => axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'SanityMigration/1.0' }
      }),
      'Image download'
    );

    const buffer = Buffer.from(response.data);
    const filename = path.basename(new URL(imageUrl).pathname);

    // Upload with retry
    const asset = await withRetry(
      () => sanityClient.assets.upload('image', buffer, { filename }),
      'Image upload'
    );

    return asset._id;
  } catch (err) {
    const error = err as Error;
    console.log(`    ⚠ Image failed after retries: ${error.message}`);
    return null;
  }
}

// Create a category document
async function createCategory(name: string): Promise<string> {
  const slug = slugify(name);
  
  if (DRY_RUN) {
    const fakeId = `category-${slug}`;
    console.log(`  [DRY RUN] Would create category: ${name} (${slug})`);
    return fakeId;
  }

  const doc = await withRetry(
    () => sanityClient.create({
      _type: 'category',
      name,
      slug: { _type: 'slug', current: slug },
      description: '', // To be updated manually in Sanity Studio
    }),
    `Create category: ${name}`
  );

  return doc._id;
}

// Create a product document
async function createProduct(
  product: ScrapedProduct,
  categoryId: string | null,
  imageAssetId: string | null
): Promise<string | null> {
  if (!product.name || !product.slug) {
    console.log(`    ⚠ Skipping product with missing name or slug`);
    return null;
  }

  const details: SanityDetail[] = product.details.map(d => ({
    _key: generateKey(),
    key: d.key,
    value: d.value,
  }));

  const doc = {
    _type: 'product' as const,
    name: product.name,
    slug: { _type: 'slug' as const, current: product.slug },
    details,
    ...(product.description && { description: product.description }),
    ...(categoryId && { category: { _type: 'reference' as const, _ref: categoryId } }),
    ...(imageAssetId && { 
      image: {
        _type: 'image' as const,
        asset: { _type: 'reference' as const, _ref: imageAssetId },
      }
    }),
  };

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create product: ${product.name}`);
    return `product-${product.slug}`;
  }

  const created = await withRetry(
    () => sanityClient.create(doc),
    `Create product: ${product.name}`
  );
  return created._id;
}

//
// MAIN MIGRATION
//
async function main(): Promise<void> {
  console.log('\n🚀 Sanity Migration Script');
  console.log('─'.repeat(50));

  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  // Check for API token
  if (!process.env.VITE_SANITY_API_TOKEN && !DRY_RUN) {
    console.error('❌ VITE_SANITY_API_TOKEN environment variable is required');
    console.error('   Set it with: export VITE_SANITY_API_TOKEN="your-token"');
    process.exit(1);
  }

  // Load scraped data
  console.log('\n📂 Loading scraped data...');
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    console.error('   Run the scraper first: npx tsx scripts/scrape-old-website.ts');
    process.exit(1);
  }

  const products: ScrapedProduct[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`  Found ${products.length} products`);

  // Extract unique categories
  const categoryNames = new Set<string>();
  products.forEach(p => {
    if (p.category) categoryNames.add(p.category);
  });
  console.log(`  Found ${categoryNames.size} unique categories`);

  // Confirmation
  console.log('\n⚠️  WARNING: This will ARCHIVE existing products and categories (prefix with "old_")!');
  const confirmed = await confirm('Do you want to proceed?');
  if (!confirmed) {
    console.log('Aborted.');
    process.exit(0);
  }

  // Step 1: Archive existing data
  console.log('\n📦 Archiving existing data...');
  const archivedProducts = await archiveAllOfType('product');
  const archivedCategories = await archiveAllOfType('category');
  console.log(`  Archived ${archivedProducts} products, ${archivedCategories} categories`);

  // Small delay after archiving
  if (!DRY_RUN) await sleep(1000);

  // Step 2: Create categories
  console.log('\n📁 Creating categories...');
  const categoryMap = new Map<string, string>(); // name → _id

  for (const name of categoryNames) {
    const id = await createCategory(name);
    categoryMap.set(name, id);
    console.log(`  ✓ ${name}`);
  }

  // Step 3: Create products with images
  console.log('\n📦 Creating products...');
  let successCount = 0;
  let failCount = 0;

  // Process in batches to manage concurrency
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    try {
      console.log(`${progress} ${product.name || 'Unnamed'}...`);

      // Upload image if available
      let imageAssetId: string | null = null;
      if (product.image && !DRY_RUN) {
        imageAssetId = await uploadImage(product.image);
        if (imageAssetId) {
          console.log(`    ✓ Image uploaded`);
        }
      }

      // Get category reference
      const categoryId = product.category ? categoryMap.get(product.category) || null : null;

      // Create product
      const productId = await createProduct(product, categoryId, imageAssetId);
      if (productId) {
        successCount++;
        console.log(`    ✓ Product created`);
      } else {
        failCount++;
      }

      // Small delay between products to avoid rate limiting
      if (!DRY_RUN && i < products.length - 1) {
        await sleep(100);
      }
    } catch (err) {
      const error = err as Error;
      console.error(`    ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('📊 Migration Summary');
  console.log('─'.repeat(50));
  console.log(`  Old products archived:  ${archivedProducts}`);
  console.log(`  Old categories archived: ${archivedCategories}`);
  console.log(`  Categories created: ${categoryMap.size}`);
  console.log(`  Products created:   ${successCount}`);
  console.log(`  Products failed:    ${failCount}`);
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Migration complete!');
  }
}

main().catch(console.error);
