/**
 * Migration Script: Static Data to Sanity CMS
 *
 * This script migrates products, clients, and articles from static data files
 * to Sanity CMS, including uploading images to Sanity's CDN.
 *
 * Prerequisites:
 * 1. Create a Sanity API token with write access in Sanity Manage
 * 2. Add VITE_SANITY_API_TOKEN to your .env.local file
 *
 * Usage:
 * npx tsx scripts/migrate-to-sanity.ts
 *
 * Note: Run this script AFTER creating categories in Sanity Studio first,
 * as products reference categories.
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: "g3xfk7os",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.VITE_SANITY_API_TOKEN,
});

// Static data (copied from src/data files)
const categories = [
  {
    slug: "air-purifiers-fresheners",
    name: "Air Purifiers & Fresheners",
    description:
      "Premium air fresheners and purifiers for a fresh, clean environment. Our range includes automatic dispensers, refills, and eco-friendly options.",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
  },
  {
    slug: "cleaning-mop",
    name: "Cleaning Mops",
    description:
      "Professional-grade mops for all floor types. From acrylic dry mops to wet mops, we have solutions for every cleaning need.",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80",
  },
  {
    slug: "tissue-paper-napkins",
    name: "Tissue Paper & Napkins",
    description:
      "High-quality tissue papers and napkins for commercial and residential use. Soft, absorbent, and eco-friendly options available.",
    image:
      "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&q=80",
  },
  {
    slug: "toilet-cleaners",
    name: "Toilet Cleaners",
    description:
      "Powerful toilet cleaning solutions that remove stains and eliminate germs while leaving a fresh fragrance.",
    image:
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&q=80",
  },
  {
    slug: "floor-cleaners",
    name: "Floor Cleaners",
    description:
      "Specialized floor cleaning solutions for marble, tiles, wood, and all types of flooring surfaces.",
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80",
  },
  {
    slug: "hand-dryers",
    name: "Hand Dryers",
    description:
      "Energy-efficient automatic hand dryers for commercial washrooms. Fast drying, hygienic, and eco-friendly.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
];

const products = [
  {
    id: "1",
    slug: "aerosol-dispenser",
    name: "Aerosol Dispenser",
    categorySlug: "air-purifiers-fresheners",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
    description:
      "Automatic aerosol dispenser for continuous freshness. Programmable intervals and low battery indicator.",
    details: {
      Brand: "AS Enterprises",
      Material: "ABS Plastic",
      Battery: "2x AA Batteries",
      "Spray Interval": "5/15/30 minutes",
      "Coverage Area": "Up to 200 sq ft",
      Warranty: "1 Year",
    },
  },
  {
    id: "2",
    slug: "air-freshener-dispenser",
    name: "Air Freshener Dispenser",
    categorySlug: "air-purifiers-fresheners",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
    description:
      "Premium automatic air freshener dispenser with multiple fragrance options. Ideal for offices and commercial spaces.",
    details: {
      Brand: "AS Enterprises",
      Material: "High-grade ABS",
      Power: "Battery Operated",
      Capacity: "300ml refill",
      "Timer Settings": "Multiple options",
      Installation: "Wall mount",
    },
  },
  {
    id: "3",
    slug: "air-freshener-refill",
    name: "Air Freshener Refill",
    categorySlug: "air-purifiers-fresheners",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80",
    description:
      "Long-lasting air freshener refills available in multiple fragrances including lavender, citrus, and ocean breeze.",
    details: {
      Brand: "AS Enterprises",
      Volume: "300ml",
      Duration: "Up to 3000 sprays",
      Fragrances: "Multiple options",
      Compatible: "All standard dispensers",
    },
  },
  {
    id: "4",
    slug: "room-freshener-gel",
    name: "Room Freshener Gel",
    categorySlug: "air-purifiers-fresheners",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
    description:
      "Continuous freshness gel that lasts up to 60 days. No electricity needed, perfect for small spaces.",
    details: {
      Brand: "AS Enterprises",
      Weight: "100g",
      Duration: "60 days",
      Coverage: "100 sq ft",
    },
  },
  {
    id: "5",
    slug: "acrylic-dry-mop",
    name: "Acrylic Dry Mop",
    categorySlug: "cleaning-mop",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80",
    description:
      "Professional acrylic dry mop that reduces bacteria by 96% compared to traditional mops. Lightweight and easy to use.",
    details: {
      "Pole Material": "Aluminium",
      Brand: "AS Enterprises",
      Size: "60 cm",
      Usage: "Floor Cleaning",
      Color: "Multicolour",
      "Mop Head Material": "Acrylic",
      Features: "Reduces bacteria by 96%",
      "Replaceable Head": "Yes",
      "Adjustable Handle": "Yes",
    },
  },
  {
    id: "6",
    slug: "scissor-mop",
    name: "Scissor Mop",
    categorySlug: "cleaning-mop",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80",
    description:
      "Heavy-duty scissor mop for commercial cleaning. Extendable handle and replaceable head.",
    details: {
      Brand: "AS Enterprises",
      Handle: "Telescopic Steel",
      Width: "40 cm",
      Material: "Microfiber",
    },
  },
  {
    id: "7",
    slug: "wet-mop-set",
    name: "Wet Mop Set",
    categorySlug: "cleaning-mop",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    description:
      "Complete wet mop set with bucket and wringer. Perfect for deep cleaning floors.",
    details: {
      Brand: "AS Enterprises",
      "Bucket Capacity": "20 Liters",
      "Mop Material": "Cotton",
      Handle: "Stainless Steel",
    },
  },
  {
    id: "8",
    slug: "microfiber-flat-mop",
    name: "Microfiber Flat Mop",
    categorySlug: "cleaning-mop",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80",
    description:
      "Professional microfiber flat mop for streak-free cleaning. Ideal for hardwood and tile floors.",
    details: {
      Brand: "AS Enterprises",
      "Head Width": "45 cm",
      Material: "Premium Microfiber",
      Handle: "Aluminium Telescopic",
    },
  },
  {
    id: "9",
    slug: "toilet-roll",
    name: "Toilet Roll",
    categorySlug: "tissue-paper-napkins",
    image:
      "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80",
    description:
      "Soft and absorbent toilet rolls for commercial and residential use. 2-ply for comfort.",
    details: {
      Brand: "AS Enterprises",
      Ply: "2-Ply",
      Sheets: "200 per roll",
      Pack: "12 rolls",
    },
  },
  {
    id: "10",
    slug: "bathroom-tissue",
    name: "Bathroom Tissue",
    categorySlug: "tissue-paper-napkins",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80",
    description:
      "Premium bathroom tissue with enhanced softness. Biodegradable and septic-safe.",
    details: {
      Brand: "AS Enterprises",
      Type: "Jumbo Roll",
      Material: "Virgin Pulp",
    },
  },
  {
    id: "11",
    slug: "dinner-napkin",
    name: "Dinner Napkin",
    categorySlug: "tissue-paper-napkins",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80",
    description:
      "Elegant dinner napkins for restaurants and events. Available in white and colored options.",
    details: {
      Brand: "AS Enterprises",
      Size: "40x40 cm",
      Ply: "2-Ply",
      Pack: "100 pieces",
    },
  },
  {
    id: "12",
    slug: "facial-tissue-box",
    name: "Facial Tissue Box",
    categorySlug: "tissue-paper-napkins",
    image:
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80",
    description:
      "Soft facial tissues for sensitive skin. 3-ply with lotion for extra care.",
    details: { Brand: "AS Enterprises", Sheets: "100 per box", Ply: "3-Ply" },
  },
  {
    id: "13",
    slug: "toilet-bowl-cleaner",
    name: "Toilet Bowl Cleaner",
    categorySlug: "toilet-cleaners",
    image:
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&q=80",
    description:
      "Powerful toilet bowl cleaner that removes tough stains and eliminates 99.9% germs.",
    details: {
      Brand: "AS Enterprises",
      Volume: "500ml",
      "Active Ingredient": "Hydrochloric Acid",
      Fragrance: "Fresh Pine",
    },
  },
  {
    id: "14",
    slug: "toilet-rim-block",
    name: "Toilet Rim Block",
    categorySlug: "toilet-cleaners",
    image:
      "https://images.unsplash.com/photo-1564429238535-f1acd72f6be0?w=500&q=80",
    description:
      "Long-lasting rim block for continuous cleaning and freshness with every flush.",
    details: {
      Brand: "AS Enterprises",
      Duration: "Up to 800 flushes",
      Pack: "3 pieces",
    },
  },
  {
    id: "15",
    slug: "marble-floor-cleaner",
    name: "Marble Floor Cleaner",
    categorySlug: "floor-cleaners",
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500&q=80",
    description:
      "Specialized cleaner for marble floors that cleans without damaging the surface shine.",
    details: {
      Brand: "AS Enterprises",
      Volume: "5 Liters",
      "pH Level": "Neutral",
      Usage: "Dilute 1:50",
    },
  },
  {
    id: "16",
    slug: "tile-floor-cleaner",
    name: "Tile Floor Cleaner",
    categorySlug: "floor-cleaners",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
    description:
      "Heavy-duty tile cleaner that removes grease, grime, and stubborn stains.",
    details: {
      Brand: "AS Enterprises",
      Volume: "5 Liters",
      Type: "Concentrated",
    },
  },
  {
    id: "17",
    slug: "automatic-hand-dryer",
    name: "Automatic Hand Dryer",
    categorySlug: "hand-dryers",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
    description:
      "High-speed automatic hand dryer with HEPA filter. Dries hands in 10-12 seconds.",
    details: {
      Brand: "AS Enterprises",
      Power: "1800W",
      "Drying Time": "10-12 seconds",
      "Noise Level": "78dB",
      Warranty: "2 Years",
    },
  },
  {
    id: "18",
    slug: "jet-hand-dryer",
    name: "Jet Hand Dryer",
    categorySlug: "hand-dryers",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80",
    description:
      "Commercial jet hand dryer with touchless operation and energy-efficient motor.",
    details: {
      Brand: "AS Enterprises",
      Power: "2100W",
      "Air Speed": "90 m/s",
      Sensor: "Infrared",
    },
  },
];

const clientCategories = [
  { name: "IT & BPO", order: 1 },
  { name: "Hospitality", order: 2 },
  { name: "Healthcare", order: 3 },
  { name: "Malls & Retail", order: 4 },
  { name: "Education", order: 5 },
  { name: "Manufacturing", order: 6 },
];

const clients = [
  {
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png",
    category: "IT & BPO",
  },
  {
    name: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png",
    category: "IT & BPO",
  },
  {
    name: "Wipro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png",
    category: "IT & BPO",
  },
  {
    name: "Tech Mahindra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Tech_Mahindra_New_Logo.svg/200px-Tech_Mahindra_New_Logo.svg.png",
    category: "IT & BPO",
  },
  {
    name: "HCL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/HCL_Technologies_logo.svg/200px-HCL_Technologies_logo.svg.png",
    category: "IT & BPO",
  },
  {
    name: "Marriott",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Marriott_hotels_logo14.svg/200px-Marriott_hotels_logo14.svg.png",
    category: "Hospitality",
  },
  {
    name: "Hyatt",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hyatt_Logo.svg/200px-Hyatt_Logo.svg.png",
    category: "Hospitality",
  },
  {
    name: "Radisson",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Radisson_logo.svg/200px-Radisson_logo.svg.png",
    category: "Hospitality",
  },
  {
    name: "ITC Hotels",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/ITC_Hotels_logo.svg/200px-ITC_Hotels_logo.svg.png",
    category: "Hospitality",
  },
  {
    name: "Taj Hotels",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Taj_Hotels_logo.svg/200px-Taj_Hotels_logo.svg.png",
    category: "Hospitality",
  },
  {
    name: "Apollo Hospitals",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Apollo_Hospitals_Logo.svg/200px-Apollo_Hospitals_Logo.svg.png",
    category: "Healthcare",
  },
  {
    name: "Fortis Healthcare",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fortis_Healthcare_logo.svg/200px-Fortis_Healthcare_logo.svg.png",
    category: "Healthcare",
  },
  {
    name: "Max Healthcare",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Max_Healthcare_logo.svg/200px-Max_Healthcare_logo.svg.png",
    category: "Healthcare",
  },
  {
    name: "Manipal Hospitals",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Manipal_Hospitals_Logo.svg/200px-Manipal_Hospitals_Logo.svg.png",
    category: "Healthcare",
  },
  {
    name: "Phoenix Mills",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Phoenix_Mills_logo.svg/200px-Phoenix_Mills_logo.svg.png",
    category: "Malls & Retail",
  },
  {
    name: "Reliance Retail",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Reliance_Retail_logo.svg/200px-Reliance_Retail_logo.svg.png",
    category: "Malls & Retail",
  },
  {
    name: "Big Bazaar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Big_Bazaar_Logo.svg/200px-Big_Bazaar_Logo.svg.png",
    category: "Malls & Retail",
  },
  {
    name: "Symbiosis",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Symbiosis_International_University_logo.svg/200px-Symbiosis_International_University_logo.svg.png",
    category: "Education",
  },
  {
    name: "MIT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png",
    category: "Education",
  },
  {
    name: "Tata Motors",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_Motors_Logo.svg/200px-Tata_Motors_Logo.svg.png",
    category: "Manufacturing",
  },
  {
    name: "Mahindra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mahindra_Rise_Logo.svg/200px-Mahindra_Rise_Logo.svg.png",
    category: "Manufacturing",
  },
  {
    name: "Bajaj Auto",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Bajaj_Auto_logo.svg/200px-Bajaj_Auto_logo.svg.png",
    category: "Manufacturing",
  },
];

const articles = [
  {
    id: "1",
    slug: "best-automatic-hand-dryer",
    title: "The Best Automatic Jet Hand Dryer in Pune",
    excerpt:
      "In today's fast-paced world, maintaining hygiene and ensuring convenience in public spaces is crucial. Automatic jet hand dryers have become an essential part of modern washroom facilities.",
    categorySlug: "air-purifiers-fresheners",
    date: "2024-06-29",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    id: "2",
    slug: "clean-hygienic-workplace-india",
    title: "The Crucial Need For A Clean And Hygienic Workplace In India",
    excerpt:
      "A clean and hygienic workplace is an essential component for the overall well-being and productivity of employees.",
    categorySlug: "air-purifiers-fresheners",
    date: "2023-12-17",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "3",
    slug: "innovative-cleaning-products",
    title: "How Innovative Cleaning Products are Elevating Indian Workplaces",
    excerpt:
      "AS Enterprise is a leading name in complete office cleaning products, washroom hygiene products & solutions.",
    categorySlug: "air-purifiers-fresheners",
    date: "2023-12-17",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  },
  {
    id: "4",
    slug: "choosing-right-floor-cleaner",
    title: "Choosing the Right Floor Cleaner for Your Space",
    excerpt:
      "Different floor types require different cleaning solutions. Learn how to select the perfect floor cleaner.",
    categorySlug: "floor-cleaners",
    date: "2023-11-15",
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80",
  },
  {
    id: "5",
    slug: "professional-mop-selection-guide",
    title: "Professional Mop Selection Guide for Commercial Spaces",
    excerpt:
      "A comprehensive guide to selecting the right mop for your commercial cleaning needs.",
    categorySlug: "cleaning-mop",
    date: "2023-10-10",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80",
  },
  {
    id: "6",
    slug: "tissue-paper-quality-matters",
    title: "Why Tissue Paper Quality Matters in Hospitality",
    excerpt:
      "In the hospitality industry, every detail counts. Learn why investing in quality tissue paper matters.",
    categorySlug: "tissue-paper-napkins",
    date: "2023-09-05",
    image:
      "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&q=80",
  },
];

// Helper function to upload image from URL to Sanity
async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    console.log(`  Uploading image: ${filename}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`  Failed to fetch image: ${imageUrl}`);
      return null;
    }
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename,
    });
    return asset._id;
  } catch (error) {
    console.error(`  Error uploading image ${imageUrl}:`, error);
    return null;
  }
}

// Migrate categories
async function migrateCategories() {
  console.log("\n📁 Migrating Categories...");
  const categoryIdMap: Record<string, string> = {};

  for (const category of categories) {
    console.log(`  Creating category: ${category.name}`);

    const imageAssetId = await uploadImageFromUrl(
      category.image,
      `category-${category.slug}.jpg`
    );

    const doc = {
      _type: "category",
      name: category.name,
      slug: { _type: "slug", current: category.slug },
      description: category.description,
      ...(imageAssetId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: imageAssetId },
        },
      }),
    };

    const result = await client.create(doc);
    categoryIdMap[category.slug] = result._id;
    console.log(`  ✅ Created: ${category.name} (${result._id})`);
  }

  return categoryIdMap;
}

// Migrate products
async function migrateProducts(categoryIdMap: Record<string, string>) {
  console.log("\n📦 Migrating Products...");

  for (const product of products) {
    console.log(`  Creating product: ${product.name}`);

    const categoryId = categoryIdMap[product.categorySlug];
    if (!categoryId) {
      console.warn(`  ⚠️ Category not found for: ${product.categorySlug}`);
      continue;
    }

    const imageAssetId = await uploadImageFromUrl(
      product.image,
      `product-${product.slug}.jpg`
    );

    const details = product.details
      ? Object.entries(product.details).map(([key, value]) => ({
          _type: "object",
          _key: key.toLowerCase().replace(/\s+/g, "-"),
          key,
          value,
        }))
      : [];

    const doc = {
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      category: { _type: "reference", _ref: categoryId },
      description: product.description,
      details,
      ...(imageAssetId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: imageAssetId },
        },
      }),
    };

    const result = await client.create(doc);
    console.log(`  ✅ Created: ${product.name} (${result._id})`);
  }
}

// Migrate client categories
async function migrateClientCategories() {
  console.log("\n🏢 Migrating Client Categories...");
  const clientCategoryIdMap: Record<string, string> = {};

  for (const category of clientCategories) {
    console.log(`  Creating client category: ${category.name}`);

    const doc = {
      _type: "clientCategory",
      name: category.name,
      order: category.order,
    };

    const result = await client.create(doc);
    clientCategoryIdMap[category.name] = result._id;
    console.log(`  ✅ Created: ${category.name} (${result._id})`);
  }

  return clientCategoryIdMap;
}

// Migrate clients
async function migrateClients(clientCategoryIdMap: Record<string, string>) {
  console.log("\n👥 Migrating Clients...");

  for (const client_ of clients) {
    console.log(`  Creating client: ${client_.name}`);

    const categoryId = clientCategoryIdMap[client_.category];
    if (!categoryId) {
      console.warn(`  ⚠️ Client category not found for: ${client_.category}`);
      continue;
    }

    const logoAssetId = await uploadImageFromUrl(
      client_.logo,
      `client-${client_.name.toLowerCase().replace(/\s+/g, "-")}.png`
    );

    const doc = {
      _type: "client",
      name: client_.name,
      category: { _type: "reference", _ref: categoryId },
      ...(logoAssetId && {
        logo: {
          _type: "image",
          asset: { _type: "reference", _ref: logoAssetId },
        },
      }),
    };

    const result = await client.create(doc);
    console.log(`  ✅ Created: ${client_.name} (${result._id})`);
  }
}

// Migrate articles
async function migrateArticles(categoryIdMap: Record<string, string>) {
  console.log("\n📝 Migrating Articles...");

  for (const article of articles) {
    console.log(`  Creating article: ${article.title}`);

    const categoryId = categoryIdMap[article.categorySlug];

    const imageAssetId = await uploadImageFromUrl(
      article.image,
      `article-${article.slug}.jpg`
    );

    const doc = {
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      excerpt: article.excerpt,
      publishedAt: new Date(article.date).toISOString(),
      ...(categoryId && {
        category: { _type: "reference", _ref: categoryId },
      }),
      ...(imageAssetId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: imageAssetId },
        },
      }),
    };

    const result = await client.create(doc);
    console.log(`  ✅ Created: ${article.title} (${result._id})`);
  }
}

// Create default site settings
async function createSiteSettings() {
  console.log("\n⚙️ Creating Site Settings...");

  // Check if site settings already exists
  const existing = await client.fetch(`*[_type == "siteSettings"][0]`);
  if (existing) {
    console.log("  ℹ️ Site settings already exists, skipping...");
    return;
  }

  const doc = {
    _type: "siteSettings",
    title: "AS Enterprises",
    description: "Premium cleaning and hygiene solutions for commercial spaces",
    phone: "+91 98765 43210",
    email: "info@asenterprises.com",
    address: "Pune, Maharashtra, India",
    heroTitle: "Premium Cleaning & Hygiene Solutions",
    heroSubtitle:
      "Your trusted partner for commercial cleaning products and washroom hygiene solutions across India.",
    aboutTitle: "About AS Enterprises",
    whyChooseUsTitle: "Why Choose Us",
    whyChooseUsPoints: [
      {
        _key: "quality",
        title: "Premium Quality",
        description:
          "We source only the best quality products from trusted manufacturers.",
        icon: "Award",
      },
      {
        _key: "service",
        title: "Reliable Service",
        description: "Timely delivery and excellent after-sales support.",
        icon: "Clock",
      },
      {
        _key: "experience",
        title: "20+ Years Experience",
        description:
          "Two decades of expertise in commercial hygiene solutions.",
        icon: "Shield",
      },
      {
        _key: "clients",
        title: "Trusted by 500+ Clients",
        description: "Leading corporations across India trust our products.",
        icon: "Users",
      },
    ],
  };

  const result = await client.create(doc);
  console.log(`  ✅ Created site settings (${result._id})`);
}

// Main migration function
async function migrate() {
  console.log("🚀 Starting Sanity Migration...\n");
  console.log("Project ID: g3xfk7os");
  console.log("Dataset: production");

  if (!process.env.VITE_SANITY_API_TOKEN) {
    console.error(
      "❌ Error: VITE_SANITY_API_TOKEN not found in environment variables"
    );
    console.log("Please add VITE_SANITY_API_TOKEN to your .env.local file");
    process.exit(1);
  }

  try {
    // Step 1: Migrate categories first (products reference these)
    const categoryIdMap = await migrateCategories();

    // Step 2: Migrate products
    await migrateProducts(categoryIdMap);

    // Step 3: Migrate client categories
    const clientCategoryIdMap = await migrateClientCategories();

    // Step 4: Migrate clients
    await migrateClients(clientCategoryIdMap);

    // Step 5: Migrate articles
    await migrateArticles(categoryIdMap);

    // Step 6: Create site settings
    await createSiteSettings();

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Visit your Sanity Studio at /studio to verify the data");
    console.log("2. Add actual product images to replace placeholders");
    console.log("3. Update site settings with your actual content");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrate();
