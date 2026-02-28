// delete-archived.ts
// Deletes all archived products and categories (those prefixed with "old_")

import { createClient, type SanityClient } from '@sanity/client';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";
import readline from 'readline';

//
// CONFIG
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

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

// Find ALL documents referencing archived categories and remove/show them
async function findAndRemoveAllReferencesToArchivedCategories(): Promise<number> {
  // First, get all archived category IDs
  const archivedCategories = await sanityClient.fetch<Array<{ _id: string; name: string }>>(
    `*[_type == "category" && name match "old_*"]{ _id, name }`
  );

  if (archivedCategories.length === 0) {
    console.log(`  No archived categories found`);
    return 0;
  }

  const archivedCategoryIds = archivedCategories.map(c => c._id);
  console.log(`  Found ${archivedCategories.length} archived categories`);

  // Find ALL documents that reference any of these category IDs
  const referencingDocs = await sanityClient.fetch<Array<{ _id: string; _type: string; name?: string }>>(
    `*[references($categoryIds)]{ _id, _type, name }`,
    { categoryIds: archivedCategoryIds }
  );

  if (referencingDocs.length === 0) {
    console.log(`  No documents referencing archived categories`);
    return 0;
  }

  console.log(`  Found ${referencingDocs.length} documents referencing archived categories:`);
  referencingDocs.forEach(doc => {
    console.log(`    - [${doc._type}] ${doc.name || doc._id}`);
  });

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would remove/update references from ${referencingDocs.length} documents`);
    return referencingDocs.length;
  }

  // Remove the category reference from these documents
  let updated = 0;
  for (const doc of referencingDocs) {
    try {
      // For products, unset the category field
      if (doc._type === 'product') {
        await sanityClient.patch(doc._id).unset(['category']).commit();
        updated++;
        console.log(`    ✓ Removed category ref from: ${doc.name || doc._id}`);
      } else {
        // For other document types, we need to figure out which field has the reference
        // Try deleting the document if it's a draft
        if (doc._id.startsWith('drafts.')) {
          await sanityClient.delete(doc._id);
          updated++;
          console.log(`    ✓ Deleted draft: ${doc._id}`);
        } else {
          console.log(`    ⚠ Unknown document type, skipping: [${doc._type}] ${doc._id}`);
        }
      }
    } catch (err) {
      const error = err as Error;
      console.log(`    ⚠ Failed to update ${doc._id}: ${error.message}`);
    }
  }

  return updated;
}

// Delete all archived documents of a type
async function deleteArchivedOfType(type: string): Promise<{ deleted: number; skipped: number }> {
  // Fetch all documents prefixed with "old_"
  const docs = await sanityClient.fetch<Array<{ _id: string; name: string; slug: { current: string } }>>(
    `*[_type == "${type}" && name match "old_*"]{ _id, name, slug }`
  );

  if (docs.length === 0) {
    console.log(`  No archived ${type} documents to delete`);
    return { deleted: 0, skipped: 0 };
  }

  // Show what will be deleted
  console.log(`  Found ${docs.length} archived ${type} documents to delete:`);
  docs.forEach(doc => {
    console.log(`    - ${doc.name} (${doc.slug?.current || 'no-slug'})`);
  });

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would delete ${docs.length} archived ${type} documents`);
    return { deleted: docs.length, skipped: 0 };
  }

  // Delete one by one to handle reference errors gracefully
  let deleted = 0;
  let skipped = 0;

  for (const doc of docs) {
    try {
      await sanityClient.delete(doc._id);
      deleted++;
    } catch (err) {
      const error = err as { statusCode?: number; message: string };
      if (error.statusCode === 409) {
        console.log(`    ⚠ Skipped "${doc.name}" - still has references`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`  Deleted ${deleted}/${docs.length} ${type} documents${skipped > 0 ? `, skipped ${skipped} with references` : ''}`);
  return { deleted, skipped };
}

//
// MAIN
//
async function main(): Promise<void> {
  console.log('\n🗑️  Delete Archived Documents Script');
  console.log('─'.repeat(50));

  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  // Check for API token
  if (!process.env.VITE_SANITY_API_TOKEN && !DRY_RUN) {
    console.error('❌ VITE_SANITY_API_TOKEN environment variable is required');
    process.exit(1);
  }

  // Confirmation
  console.log('\n⚠️  WARNING: This will PERMANENTLY DELETE all archived products and categories!');
  console.log('   (Documents with names starting with "old_")');
  const confirmed = await confirm('\nDo you want to proceed?');
  if (!confirmed) {
    console.log('Aborted.');
    process.exit(0);
  }

  // Step 1: Find and remove ALL references to archived categories
  console.log('\n🔗 Finding and removing references to archived categories...');
  const refsRemoved = await findAndRemoveAllReferencesToArchivedCategories();

  // Step 2: Delete archived products
  console.log('\n🗑️  Deleting archived products...');
  const productResult = await deleteArchivedOfType('product');

  // Step 3: Delete archived categories
  console.log('\n🗑️  Deleting archived categories...');
  const categoryResult = await deleteArchivedOfType('category');

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('📊 Deletion Summary');
  console.log('─'.repeat(50));
  console.log(`  Referencing docs fixed: ${refsRemoved}`);
  console.log(`  Products deleted:      ${productResult.deleted}${productResult.skipped > 0 ? ` (${productResult.skipped} skipped)` : ''}`);
  console.log(`  Categories deleted:    ${categoryResult.deleted}${categoryResult.skipped > 0 ? ` (${categoryResult.skipped} skipped)` : ''}`);
  
  if (DRY_RUN) {
    console.log('\n⚠️  This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Deletion complete!');
  }
}

main().catch(console.error);
