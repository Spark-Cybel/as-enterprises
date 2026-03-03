// generate-product-codes.ts
// Generates HSN-like product codes for all products in Sanity CMS
// Format: {CATEGORY_PREFIX}-{4_DIGIT_RANDOM} (e.g., ELEC-7839)

import { createClient, type SanityClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

//
// TYPES
//
interface SanityProduct {
  _id: string;
  name: string;
  category: {
    name: string;
    slug: { current: string };
  } | null;
}

interface ProductUpdate {
  _id: string;
  name: string;
  categoryPrefix: string;
  productCode: string;
}

//
// CONFIG
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 50;

// Sanity client for mutations
const sanityClient: SanityClient = createClient({
  projectId: "g3xfk7os",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.VITE_SANITY_API_TOKEN,
});

//
// HELPERS
//

/**
 * Generate a category prefix from the category slug
 * Takes first 4 characters, uppercased. Falls back to "PROD" if no category.
 */
function getCategoryPrefix(category: SanityProduct["category"]): string {
  if (!category || !category.slug?.current) {
    return "PROD";
  }

  const slug = category.slug.current;
  // Remove hyphens and take first 4 chars
  const cleanSlug = slug.replace(/-/g, "").toUpperCase();
  return cleanSlug.slice(0, 4).padEnd(4, "X");
}

/**
 * Generate a random 4-digit number string (0000-9999)
 */
function generateRandomDigits(): string {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
}

/**
 * Generate a unique product code for a category, avoiding collisions
 */
function generateUniqueCode(
  prefix: string,
  usedCodes: Set<string>,
  maxAttempts = 10
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const code = `${prefix}-${generateRandomDigits()}`;
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      return code;
    }
  }
  // Fallback: use timestamp suffix if too many collisions
  const fallbackCode = `${prefix}-${Date.now().toString().slice(-4)}`;
  usedCodes.add(fallbackCode);
  return fallbackCode;
}

/**
 * Retry wrapper for async operations
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  retries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        console.error(`❌ Failed after ${retries} attempts: ${context}`);
        throw error;
      }
      console.log(`⚠️  Attempt ${attempt} failed for ${context}, retrying...`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error("Unreachable");
}

//
// MAIN
//
async function main() {
  console.log("🏷️  Product Code Generator");
  console.log("==========================");

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE - No changes will be made\n");
  }

  // Verify token
  if (!process.env.VITE_SANITY_API_TOKEN) {
    console.error("❌ VITE_SANITY_API_TOKEN not found in .env.local");
    process.exit(1);
  }

  // Fetch all products with their categories
  console.log("📥 Fetching products from Sanity...");
  const products = await withRetry(
    () =>
      sanityClient.fetch<SanityProduct[]>(
        `*[_type == "product"]{
          _id,
          name,
          category->{ name, slug }
        }`
      ),
    "Fetch products"
  );

  console.log(`📦 Found ${products.length} products\n`);

  if (products.length === 0) {
    console.log("No products to update.");
    return;
  }

  // Track used codes per category to avoid duplicates
  const usedCodesByCategory: Map<string, Set<string>> = new Map();

  // Generate codes for all products
  const updates: ProductUpdate[] = products.map((product) => {
    const prefix = getCategoryPrefix(product.category);

    if (!usedCodesByCategory.has(prefix)) {
      usedCodesByCategory.set(prefix, new Set());
    }

    const productCode = generateUniqueCode(
      prefix,
      usedCodesByCategory.get(prefix)!
    );

    return {
      _id: product._id,
      name: product.name,
      categoryPrefix: prefix,
      productCode,
    };
  });

  // Log preview
  console.log("📋 Generated codes preview:");
  console.log("----------------------------");
  updates.slice(0, 10).forEach((u) => {
    console.log(`  ${u.productCode} → ${u.name.slice(0, 50)}`);
  });
  if (updates.length > 10) {
    console.log(`  ... and ${updates.length - 10} more\n`);
  }

  // Group by prefix for summary
  const prefixCounts = new Map<string, number>();
  updates.forEach((u) => {
    prefixCounts.set(u.categoryPrefix, (prefixCounts.get(u.categoryPrefix) || 0) + 1);
  });
  console.log("\n📊 Codes by category prefix:");
  prefixCounts.forEach((count, prefix) => {
    console.log(`  ${prefix}: ${count} products`);
  });
  console.log();

  if (DRY_RUN) {
    console.log("✅ Dry run complete. Run without --dry-run to apply changes.");
    return;
  }

  // Apply updates in batches
  console.log(`🚀 Updating ${updates.length} products in batches of ${BATCH_SIZE}...`);
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(updates.length / BATCH_SIZE);

    try {
      await withRetry(async () => {
        const transaction = sanityClient.transaction();

        batch.forEach((update) => {
          transaction.patch(update._id, {
            set: { productCode: update.productCode },
          });
        });

        await transaction.commit();
      }, `Batch ${batchNum}/${totalBatches}`);

      successCount += batch.length;
      console.log(
        `  ✅ Batch ${batchNum}/${totalBatches} complete (${successCount}/${updates.length})`
      );
    } catch (error) {
      errorCount += batch.length;
      console.error(`  ❌ Batch ${batchNum} failed:`, error);
    }

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < updates.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\n==========================");
  console.log(`✅ Updated: ${successCount} products`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} products`);
  }
  console.log("🏷️  Product code generation complete!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
