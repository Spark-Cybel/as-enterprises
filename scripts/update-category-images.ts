// update-category-images.ts
// Updates all categories with images and descriptions

import { createClient, type SanityClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";
import readline from 'readline';

//
// TYPES
//
interface CategoryData {
  imageFileName: string;
  categoryName: string;
  description: string;
}

interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
}

//
// CONFIG
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const IMAGES_DIR = path.resolve(__dirname, '../src/assets/categories');
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
// CATEGORY DATA MAPPING
//
const CATEGORY_DATA: CategoryData[] = [
  {
    imageFileName: 'tissue-paper.jpg',
    categoryName: 'Tissue Paper Napkins',
    description: 'Premium tissue rolls, napkin dispensers, and paper products for restrooms and kitchens.',
  },
  {
    imageFileName: 'cleaning-brushes.jpg',
    categoryName: 'Cleaning Brushes',
    description: 'Deck brushes, scrub brushes, and specialty tools for deep cleaning tasks.',
  },
  {
    imageFileName: 'cleaning-mops.jpg',
    categoryName: 'Cleaning Mop',
    description: 'Microfiber flat mops, spin mops, and wet-dry systems for spotless floors.',
  },
  {
    imageFileName: 'buckets-storage.jpg',
    categoryName: 'Buckets, Mugs & Storage Bins',
    description: 'Durable plastic buckets, mugs, and organized storage bins for janitorial needs.',
  },
  {
    imageFileName: 'mosquito-repellent.jpg',
    categoryName: 'Mosquito & Insect Repellent',
    description: 'Sprays, electric repellents, and traps for effective pest control indoors and outdoors.',
  },
  {
    imageFileName: 'brooms-dusters.jpg',
    categoryName: 'Brooms & Dusters',
    description: 'Heavy-duty floor brooms, feather dusters, and cobweb removers for daily upkeep.',
  },
  {
    imageFileName: 'aroma-diffuser.jpg',
    categoryName: 'Electronic Aroma Diffuser',
    description: 'Ultrasonic diffusers with LED lighting for soothing aromatherapy and ambient fragrance.',
  },
  {
    imageFileName: 'single-disc-machine.jpg',
    categoryName: 'Single Disc Machine',
    description: 'Powerful floor polishers and scrubbers for buffing, stripping, and deep cleaning.',
  },
  {
    imageFileName: 'air-scenting.jpg',
    categoryName: 'Air Scenting Unit',
    description: 'Programmable wall-mounted units for consistent, long-lasting commercial fragrance.',
  },
  {
    imageFileName: 'hand-sanitizers.jpg',
    categoryName: 'Hand Sanitizers',
    description: 'Touchless dispensers and alcohol-based sanitizers for complete hand hygiene.',
  },
  {
    imageFileName: 'disinfection-chamber.jpg',
    categoryName: 'Body Disinfection Chamber',
    description: 'Walk-through sanitization tunnels for full-body disinfection at entry points.',
  },
  {
    imageFileName: 'cleaning-machines.jpg',
    categoryName: 'Cleaning Machines',
    description: 'Industrial-grade scrubbers, polishers, and auto-scrubbers for large-scale cleaning.',
  },
  {
    imageFileName: 'hand-dryers.jpg',
    categoryName: 'Hand Dryers',
    description: 'High-speed jet dryers and energy-efficient warm air dryers for washrooms.',
  },
  {
    imageFileName: 'vacuum-cleaners.jpg',
    categoryName: 'Vacuum Cleaner',
    description: 'Wet & dry vacuums, upright and backpack models for every surface type.',
  },
  {
    imageFileName: 'air-purifiers.jpg',
    categoryName: 'Air Purifiers & Fresheners',
    description: 'HEPA filtration systems and aromatic fresheners for pristine indoor air quality.',
  },
  {
    imageFileName: 'sensor-dispenser.jpg',
    categoryName: 'Sensor Dispenser',
    description: 'Automatic touchless soap and sanitizer dispensers for hygienic hands-free operation.',
  },
  {
    imageFileName: 'cleaning-liquids.jpg',
    categoryName: 'Cleaning Liquids & Wipes',
    description: 'Disinfectants, degreasers, glass cleaners, and sanitizing wipes for all surfaces.',
  },
  {
    imageFileName: 'paper-cup-dispenser.jpg',
    categoryName: 'Paper Cup Dispenser',
    description: 'Wall-mounted and countertop dispensers for organized paper cup storage.',
  },
  {
    imageFileName: 'uncategorized.jpg',
    categoryName: 'Uncategorized',
    description: 'Explore our miscellaneous cleaning and hygiene products and accessories.',
  },
];

//
// HELPERS
//
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

// Upload image from local file
async function uploadImageFromFile(filePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`    ⚠ Image file not found: ${filePath}`);
      return null;
    }

    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);

    // Upload with retry
    const asset = await withRetry(
      () => sanityClient.assets.upload('image', buffer, { filename }),
      'Image upload'
    );

    return asset._id;
  } catch (err) {
    const error = err as Error;
    console.log(`    ⚠ Image upload failed: ${error.message}`);
    return null;
  }
}

// Fetch all categories from Sanity
async function fetchCategories(): Promise<SanityCategory[]> {
  return sanityClient.fetch<SanityCategory[]>(
    `*[_type == "category" && !(name match "old_*")]{ _id, name, slug }`
  );
}

// Update a category with description and image
async function updateCategory(
  categoryId: string,
  description: string,
  imageAssetId: string | null
): Promise<void> {
  const patch: Record<string, unknown> = {
    description,
  };

  if (imageAssetId) {
    patch.image = {
      _type: 'image',
      asset: { _type: 'reference', _ref: imageAssetId },
    };
  }

  await withRetry(
    () => sanityClient.patch(categoryId).set(patch).commit(),
    'Update category'
  );
}

// Normalize category name for matching (case-insensitive, trim whitespace)
function normalizeForMatch(name: string): string {
  return name.toLowerCase().trim();
}

//
// MAIN SCRIPT
//
async function main(): Promise<void> {
  console.log('\n🚀 Category Image & Description Update Script');
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

  // Check images directory
  console.log('\n📂 Checking images directory...');
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    console.error('   Create the directory and add category images first.');
    process.exit(1);
  }

  // Check which images exist
  const existingImages = fs.readdirSync(IMAGES_DIR);
  console.log(`  Found ${existingImages.length} images in directory`);

  const missingImages: string[] = [];
  CATEGORY_DATA.forEach(cat => {
    if (!existingImages.includes(cat.imageFileName)) {
      missingImages.push(cat.imageFileName);
    }
  });

  if (missingImages.length > 0) {
    console.log(`\n⚠️  Missing images (${missingImages.length}):`);
    missingImages.forEach(img => console.log(`    - ${img}`));
  }

  // Fetch existing categories
  console.log('\n📁 Fetching existing categories from Sanity...');
  const categories = await fetchCategories();
  console.log(`  Found ${categories.length} categories`);

  // Match categories with data
  const categoryNameMap = new Map<string, SanityCategory>();
  categories.forEach(cat => {
    categoryNameMap.set(normalizeForMatch(cat.name), cat);
  });

  // Show what will be updated
  console.log('\n📋 Categories to update:');
  const matchedCategories: Array<{ data: CategoryData; sanityCategory: SanityCategory }> = [];
  const unmatchedCategories: CategoryData[] = [];

  CATEGORY_DATA.forEach(data => {
    const normalized = normalizeForMatch(data.categoryName);
    const sanityCategory = categoryNameMap.get(normalized);
    
    if (sanityCategory) {
      matchedCategories.push({ data, sanityCategory });
      const hasImage = existingImages.includes(data.imageFileName);
      console.log(`  ✓ ${data.categoryName} ${hasImage ? '(with image)' : '(no image)'}`);
    } else {
      unmatchedCategories.push(data);
    }
  });

  if (unmatchedCategories.length > 0) {
    console.log(`\n⚠️  Unmatched categories (${unmatchedCategories.length}):`);
    unmatchedCategories.forEach(cat => {
      console.log(`    - ${cat.categoryName}`);
    });
    console.log('  These categories do not exist in Sanity and will be skipped.');
  }

  // Confirmation
  if (matchedCategories.length === 0) {
    console.log('\n❌ No categories to update. Exiting.');
    process.exit(0);
  }

  console.log(`\n📊 Summary: ${matchedCategories.length} categories will be updated`);
  const confirmed = await confirm('Do you want to proceed?');
  if (!confirmed) {
    console.log('Aborted.');
    process.exit(0);
  }

  // Update categories
  console.log('\n🔄 Updating categories...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < matchedCategories.length; i++) {
    const { data, sanityCategory } = matchedCategories[i];
    const progress = `[${i + 1}/${matchedCategories.length}]`;

    try {
      console.log(`${progress} ${data.categoryName}...`);

      // Upload image if exists
      let imageAssetId: string | null = null;
      const imagePath = path.join(IMAGES_DIR, data.imageFileName);
      
      if (fs.existsSync(imagePath) && !DRY_RUN) {
        imageAssetId = await uploadImageFromFile(imagePath);
        if (imageAssetId) {
          console.log(`    ✓ Image uploaded`);
        }
      } else if (!fs.existsSync(imagePath)) {
        console.log(`    ⚠ Image not found: ${data.imageFileName}`);
      }

      // Update category
      if (DRY_RUN) {
        console.log(`    [DRY RUN] Would update description and image`);
      } else {
        await updateCategory(sanityCategory._id, data.description, imageAssetId);
        console.log(`    ✓ Category updated`);
      }

      successCount++;

      // Small delay between updates
      if (!DRY_RUN && i < matchedCategories.length - 1) {
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
  console.log('📊 Update Summary');
  console.log('─'.repeat(50));
  console.log(`  Categories updated: ${successCount}`);
  console.log(`  Categories failed:  ${failCount}`);
  console.log(`  Categories skipped: ${unmatchedCategories.length}`);
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Update complete!');
  }
}

main().catch(console.error);
