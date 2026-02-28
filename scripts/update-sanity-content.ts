/**
 * Update Script: Update Sanity CMS Content for New Business Branding
 *
 * This script updates the Sanity CMS with new company branding:
 * - Updated site settings (tagline, about content, why choose us)
 * - Updated articles with fresh, authentic content
 *
 * Prerequisites:
 * 1. Sanity API token with write access in your .env.local file
 * 2. Run the initial migration script first if you haven't already
 *
 * Usage:
 * npx tsx scripts/update-sanity-content.ts
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

// New site settings content
const newSiteSettings = {
  title: "AS Enterprises",
  description:
    "Your Trusted Partner in Cleaning & Hygiene Solutions. Providing genuine, premium quality cleaning products across India.",
  heroTitle: "Your Trusted Partner in Cleaning & Hygiene Solutions",
  heroSubtitle:
    "Premium Quality Products | Trusted Brands | Pan-India Delivery",
  aboutTitle: "About AS Enterprises",
  aboutContent: [
    {
      _type: "block",
      _key: "about1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "about1span",
          text: "AS Enterprises is your trusted cleaning solutions partner, bringing you premium cleaning and hygiene products backed by industry expertise. With an extensive network of quality suppliers, we ensure you receive only certified, quality-tested products at competitive prices.",
        },
      ],
    },
    {
      _type: "block",
      _key: "about2",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "about2span",
          text: "Our commitment is simple: deliver genuine products, maintain transparent pricing, and provide reliable service. Whether you're managing a corporate office, hotel, hospital, or retail space, we have the right cleaning solutions for your needs. Experience the difference of working with a trusted partner who prioritizes your satisfaction.",
        },
      ],
    },
  ],
  whyChooseUsTitle: "Why Choose Us",
  whyChooseUsPoints: [
    {
      _key: "premium-quality",
      title: "Premium Quality Products",
      description:
        "Genuine products sourced from trusted brands with manufacturer warranty and quality assurance.",
      icon: "Award",
    },
    {
      _key: "competitive-pricing",
      title: "Competitive Pricing",
      description:
        "Dealer-direct pricing means better rates without compromising on product authenticity.",
      icon: "Truck",
    },
    {
      _key: "genuine-products",
      title: "100% Genuine Products",
      description:
        "Every product is sourced directly from authorized channels—no duplicates, no compromises.",
      icon: "CheckCircle",
    },
    {
      _key: "reliable-delivery",
      title: "Reliable Delivery",
      description:
        "Pan-India delivery network ensuring your orders reach you on time, every time.",
      icon: "Clock",
    },
    {
      _key: "expert-guidance",
      title: "Expert Guidance",
      description:
        "Industry experience to help you choose the right products for your specific requirements.",
      icon: "Users",
    },
    {
      _key: "customer-first",
      title: "Customer-First Approach",
      description:
        "Personalized service and dedicated support for all your queries and requirements.",
      icon: "HeadphonesIcon",
    },
  ],
};

// Updated articles content
const updatedArticles = [
  {
    slug: "best-automatic-hand-dryer",
    title: "The Best Automatic Jet Hand Dryer in Pune",
    excerpt:
      "Looking for reliable automatic jet hand dryers in Pune? Discover how modern hand dryers can transform your washroom hygiene while reducing costs and environmental impact.",
    categorySlug: "hand-dryers",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "hd1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "hd1span",
            text: "Modern washroom facilities demand efficient, hygienic solutions. Automatic jet hand dryers have become essential for businesses prioritizing cleanliness and sustainability.",
          },
        ],
      },
      {
        _type: "block",
        _key: "hd2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "hd2span",
            text: "Why Choose Automatic Hand Dryers?",
          },
        ],
      },
      {
        _type: "block",
        _key: "hd3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "hd3span",
            text: "Automatic hand dryers offer several advantages over traditional paper towels: eco-friendly operation that reduces paper waste, cost-effective solution eliminating ongoing paper towel expenses, hygienic touchless operation minimizing germ spread, and low maintenance requirements.",
          },
        ],
      },
      {
        _type: "block",
        _key: "hd4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "hd4span",
            text: "At AS Enterprises, we offer premium hand dryers from trusted brands that meet all these requirements, backed by manufacturer warranty.",
          },
        ],
      },
    ],
  },
  {
    slug: "clean-hygienic-workplace-india",
    title: "The Crucial Need For A Clean And Hygienic Workplace In India",
    excerpt:
      "A clean workplace directly impacts employee productivity and well-being. Learn about essential hygiene products every Indian workplace needs.",
    categorySlug: "air-purifiers-fresheners",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "wp1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "wp1span",
            text: "A clean and hygienic workplace is essential for employee well-being and productivity in today's competitive business environment.",
          },
        ],
      },
      {
        _type: "block",
        _key: "wp2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "wp2span",
            text: "Impact on Productivity",
          },
        ],
      },
      {
        _type: "block",
        _key: "wp3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "wp3span",
            text: "Studies show that clean work environments can boost productivity by up to 15%. Employees in clean spaces report higher job satisfaction and fewer sick days.",
          },
        ],
      },
      {
        _type: "block",
        _key: "wp4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "wp4span",
            text: "Essential hygiene products include hand sanitizers at entry points, quality tissue papers and napkins, regular floor cleaning supplies, air fresheners for common areas, and automatic dispensers for touchless hygiene. Partnering with an authorized dealer ensures you receive genuine products that deliver consistent performance.",
          },
        ],
      },
    ],
  },
  {
    slug: "innovative-cleaning-products",
    title: "How to Choose the Right Cleaning Products for Your Business",
    excerpt:
      "Selecting the right cleaning products can be overwhelming. Here's a comprehensive guide to help you make informed decisions for your facility.",
    categorySlug: "air-purifiers-fresheners",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "cp1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "cp1span",
            text: "Choosing quality cleaning products is crucial for maintaining a professional environment. Here's what to consider when making your selection.",
          },
        ],
      },
      {
        _type: "block",
        _key: "cp2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "cp2span",
            text: "Key Selection Criteria",
          },
        ],
      },
      {
        _type: "block",
        _key: "cp3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "cp3span",
            text: "Always source from authorized dealers to ensure genuine products. Match products to your specific cleaning needs. Consider long-term value over initial price. Check for certifications and safety standards.",
          },
        ],
      },
      {
        _type: "block",
        _key: "cp4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "cp4span",
            text: "Working with a trusted supplier gives you access to quality-certified products with proper warranty support.",
          },
        ],
      },
    ],
  },
  {
    slug: "choosing-right-floor-cleaner",
    title: "Choosing the Right Floor Cleaner for Your Space",
    excerpt:
      "Different floor types require different cleaning solutions. Learn how to select the perfect floor cleaner for marble, tiles, wood, and other surfaces.",
    categorySlug: "floor-cleaners",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "fc1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fc1span",
            text: "Choosing the right floor cleaner is essential for maintaining the beauty and longevity of your flooring.",
          },
        ],
      },
      {
        _type: "block",
        _key: "fc2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "fc2span",
            text: "Floor Types and Their Needs",
          },
        ],
      },
      {
        _type: "block",
        _key: "fc3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fc3span",
            text: "Marble requires pH-neutral cleaners to prevent etching. Tiles can handle stronger detergents for deep cleaning. Wood needs gentle, moisture-controlled products. Vinyl is compatible with most mild cleaners.",
          },
        ],
      },
      {
        _type: "block",
        _key: "fc4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fc4span",
            text: "Pro tips: Always test cleaners in an inconspicuous area first. Use the recommended dilution ratios. Invest in quality mops designed for your floor type. Our range of premium floor cleaners covers all surface types with specialized formulations.",
          },
        ],
      },
    ],
  },
  {
    slug: "professional-mop-selection-guide",
    title: "Professional Mop Selection Guide for Commercial Spaces",
    excerpt:
      "A comprehensive guide to selecting the right mop for your commercial cleaning needs, from dry mops to wet mops and everything in between.",
    categorySlug: "cleaning-mop",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "mp1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "mp1span",
            text: "The right mop can make a significant difference in cleaning efficiency and results for commercial spaces.",
          },
        ],
      },
      {
        _type: "block",
        _key: "mp2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "mp2span",
            text: "Types of Mops and Their Uses",
          },
        ],
      },
      {
        _type: "block",
        _key: "mp3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "mp3span",
            text: "Acrylic Dry Mops are ideal for dust and debris on smooth floors. Microfiber Mops are perfect for thorough cleaning with minimal water. Cotton Wet Mops are best for heavy-duty cleaning and spills. Scissor Mops are designed for large floor areas in commercial settings.",
          },
        ],
      },
      {
        _type: "block",
        _key: "mp4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "mp4span",
            text: "When choosing the right mop, consider your floor type and size, evaluate cleaning frequency requirements, look for replaceable heads for cost efficiency, and choose ergonomic handles for user comfort. Quality mops from authorized dealers ensure durability and better cleaning performance.",
          },
        ],
      },
    ],
  },
  {
    slug: "tissue-paper-quality-matters",
    title: "Why Tissue Paper Quality Matters in Hospitality",
    excerpt:
      "In the hospitality industry, every detail counts. Learn why investing in quality tissue paper can enhance your guest experience and reflect your brand standards.",
    categorySlug: "tissue-paper-napkins",
    date: "2026-01-04",
    content: [
      {
        _type: "block",
        _key: "tp1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp1span",
            text: "Quality tissue paper is more than just a necessity - it's a reflection of your establishment's standards and attention to detail.",
          },
        ],
      },
      {
        _type: "block",
        _key: "tp2",
        style: "h2",
        children: [
          {
            _type: "span",
            _key: "tp2span",
            text: "Key Quality Factors",
          },
        ],
      },
      {
        _type: "block",
        _key: "tp3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp3span",
            text: "Softness and comfort - guests notice the difference. Absorbency - efficient products reduce usage. Strength when wet - prevents tearing and waste. Eco-friendly materials - appeals to environmentally conscious guests.",
          },
        ],
      },
      {
        _type: "block",
        _key: "tp4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp4span",
            text: "Quality matters because it enhances guest perception of your brand, reduces long-term costs through efficiency, supports sustainability initiatives, and ensures consistent supply with reliable dealers. Partnering with an authorized dealer ensures consistent quality and availability for your hospitality needs.",
          },
        ],
      },
    ],
  },
];

// Update site settings
async function updateSiteSettings() {
  console.log("\n⚙️ Updating Site Settings...");

  try {
    // Find existing site settings
    const existing = await client.fetch(`*[_type == "siteSettings"][0]`);

    if (existing) {
      // Update existing settings
      const result = await client
        .patch(existing._id)
        .set({
          title: newSiteSettings.title,
          description: newSiteSettings.description,
          heroTitle: newSiteSettings.heroTitle,
          heroSubtitle: newSiteSettings.heroSubtitle,
          aboutTitle: newSiteSettings.aboutTitle,
          aboutContent: newSiteSettings.aboutContent,
          whyChooseUsTitle: newSiteSettings.whyChooseUsTitle,
          whyChooseUsPoints: newSiteSettings.whyChooseUsPoints,
        })
        .commit();

      console.log(`  ✅ Updated site settings (${result._id})`);
    } else {
      // Create new settings
      const doc = {
        _type: "siteSettings",
        ...newSiteSettings,
      };
      const result = await client.create(doc);
      console.log(`  ✅ Created site settings (${result._id})`);
    }
  } catch (error) {
    console.error("  ❌ Error updating site settings:", error);
    throw error;
  }
}

// Update articles
async function updateArticles() {
  console.log("\n📝 Updating Articles...");

  // First, get category IDs
  const categories = await client.fetch(`*[_type == "category"]{
    _id,
    "slug": slug.current
  }`);

  const categoryMap: Record<string, string> = {};
  categories.forEach((cat: { _id: string; slug: string }) => {
    categoryMap[cat.slug] = cat._id;
  });

  for (const article of updatedArticles) {
    console.log(`  Updating article: ${article.title}`);

    try {
      // Find existing article by slug
      const existing = await client.fetch(
        `*[_type == "article" && slug.current == $slug][0]`,
        { slug: article.slug }
      );

      const categoryId = categoryMap[article.categorySlug];

      if (existing) {
        // Update existing article
        const updateData: Record<string, unknown> = {
          title: article.title,
          excerpt: article.excerpt,
          publishedAt: new Date(article.date).toISOString(),
          content: article.content,
        };

        if (categoryId) {
          updateData.category = { _type: "reference", _ref: categoryId };
        }

        const result = await client
          .patch(existing._id)
          .set(updateData)
          .commit();

        console.log(`  ✅ Updated: ${article.title} (${result._id})`);
      } else {
        // Create new article
        const doc: Record<string, unknown> = {
          _type: "article",
          title: article.title,
          slug: { _type: "slug", current: article.slug },
          excerpt: article.excerpt,
          publishedAt: new Date(article.date).toISOString(),
          content: article.content,
        };

        if (categoryId) {
          doc.category = { _type: "reference", _ref: categoryId };
        }

        const result = await client.create(doc);
        console.log(`  ✅ Created: ${article.title} (${result._id})`);
      }
    } catch (error) {
      console.error(`  ❌ Error updating article ${article.title}:`, error);
    }
  }
}

// Main update function
async function updateContent() {
  console.log("🚀 Starting Sanity Content Update...\n");
  console.log("Project ID: g3xfk7os");
  console.log("Dataset: production");
  console.log("\nThis will update:");
  console.log("  - Site settings (tagline, about, why choose us)");
  console.log("  - All 6 articles with new authentic content");

  if (!process.env.VITE_SANITY_API_TOKEN) {
    console.error(
      "\n❌ Error: VITE_SANITY_API_TOKEN not found in environment variables"
    );
    console.log("Please add VITE_SANITY_API_TOKEN to your .env.local file");
    process.exit(1);
  }

  try {
    // Step 1: Update site settings
    await updateSiteSettings();

    // Step 2: Update articles
    await updateArticles();

    console.log("\n✅ Content update completed successfully!");
    console.log("\nChanges made:");
    console.log("  ✓ Site settings updated with trusted partner branding");
    console.log(
      "  ✓ Hero title: 'Your Trusted Partner in Cleaning & Hygiene Solutions'"
    );
    console.log("  ✓ 6 'Why Choose Us' points");
    console.log("  ✓ Updated about content");
    console.log("  ✓ All 6 articles updated with fresh content");
    console.log("\nNext steps:");
    console.log("1. Visit your Sanity Studio at /studio to verify the changes");
    console.log("2. Clear any CDN cache if using cached API responses");
    console.log("3. Refresh your website to see the new content");
  } catch (error) {
    console.error("\n❌ Content update failed:", error);
    process.exit(1);
  }
}

// Run update
updateContent();
