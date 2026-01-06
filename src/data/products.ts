export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  description?: string;
  details?: Record<string, string>;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: "air-purifiers-fresheners",
    name: "Air Purifiers & Fresheners",
    description: "Premium air fresheners and purifiers for a fresh, clean environment. Our range includes automatic dispensers, refills, and eco-friendly options.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80"
  },
  {
    slug: "cleaning-mop",
    name: "Cleaning Mops",
    description: "Professional-grade mops for all floor types. From acrylic dry mops to wet mops, we have solutions for every cleaning need.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80"
  },
  {
    slug: "tissue-paper-napkins",
    name: "Tissue Paper & Napkins",
    description: "High-quality tissue papers and napkins for commercial and residential use. Soft, absorbent, and eco-friendly options available.",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&q=80"
  },
  {
    slug: "toilet-cleaners",
    name: "Toilet Cleaners",
    description: "Powerful toilet cleaning solutions that remove stains and eliminate germs while leaving a fresh fragrance.",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&q=80"
  },
  {
    slug: "floor-cleaners",
    name: "Floor Cleaners",
    description: "Specialized floor cleaning solutions for marble, tiles, wood, and all types of flooring surfaces.",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80"
  },
  {
    slug: "hand-dryers",
    name: "Hand Dryers",
    description: "Energy-efficient automatic hand dryers for commercial washrooms. Fast drying, hygienic, and eco-friendly.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
  }
];

export const products: Product[] = [
  // Air Purifiers & Fresheners
  {
    id: "1",
    slug: "aerosol-dispenser",
    name: "Aerosol Dispenser",
    category: "Air Purifiers & Fresheners",
    categorySlug: "air-purifiers-fresheners",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
    description: "Automatic aerosol dispenser for continuous freshness. Programmable intervals and low battery indicator.",
    details: {
      "Brand": "AS Enterprises",
      "Material": "ABS Plastic",
      "Battery": "2x AA Batteries",
      "Spray Interval": "5/15/30 minutes",
      "Coverage Area": "Up to 200 sq ft",
      "Warranty": "1 Year"
    }
  },
  {
    id: "2",
    slug: "air-freshener-dispenser",
    name: "Air Freshener Dispenser",
    category: "Air Purifiers & Fresheners",
    categorySlug: "air-purifiers-fresheners",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
    description: "Premium automatic air freshener dispenser with multiple fragrance options. Ideal for offices and commercial spaces.",
    details: {
      "Brand": "AS Enterprises",
      "Material": "High-grade ABS",
      "Power": "Battery Operated",
      "Capacity": "300ml refill",
      "Timer Settings": "Multiple options",
      "Installation": "Wall mount"
    }
  },
  {
    id: "3",
    slug: "air-freshener-refill",
    name: "Air Freshener Refill",
    category: "Air Purifiers & Fresheners",
    categorySlug: "air-purifiers-fresheners",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80",
    description: "Long-lasting air freshener refills available in multiple fragrances including lavender, citrus, and ocean breeze.",
    details: {
      "Brand": "AS Enterprises",
      "Volume": "300ml",
      "Duration": "Up to 3000 sprays",
      "Fragrances": "Multiple options",
      "Compatible": "All standard dispensers"
    }
  },
  {
    id: "4",
    slug: "room-freshener-gel",
    name: "Room Freshener Gel",
    category: "Air Purifiers & Fresheners",
    categorySlug: "air-purifiers-fresheners",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
    description: "Continuous freshness gel that lasts up to 60 days. No electricity needed, perfect for small spaces.",
    details: {
      "Brand": "AS Enterprises",
      "Weight": "100g",
      "Duration": "60 days",
      "Coverage": "100 sq ft"
    }
  },
  // Cleaning Mops
  {
    id: "5",
    slug: "acrylic-dry-mop",
    name: "Acrylic Dry Mop",
    category: "Cleaning Mops",
    categorySlug: "cleaning-mop",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80",
    description: "Professional acrylic dry mop that reduces bacteria by 96% compared to traditional mops. Lightweight and easy to use.",
    details: {
      "Pole Material": "Aluminium",
      "Brand": "AS Enterprises",
      "Size": "60 cm",
      "Usage": "Floor Cleaning",
      "Color": "Multicolour",
      "Mop Head Material": "Acrylic",
      "Features": "Reduces bacteria by 96%",
      "Replaceable Head": "Yes",
      "Adjustable Handle": "Yes"
    }
  },
  {
    id: "6",
    slug: "scissor-mop",
    name: "Scissor Mop",
    category: "Cleaning Mops",
    categorySlug: "cleaning-mop",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80",
    description: "Heavy-duty scissor mop for commercial cleaning. Extendable handle and replaceable head.",
    details: {
      "Brand": "AS Enterprises",
      "Handle": "Telescopic Steel",
      "Width": "40 cm",
      "Material": "Microfiber"
    }
  },
  {
    id: "7",
    slug: "wet-mop-set",
    name: "Wet Mop Set",
    category: "Cleaning Mops",
    categorySlug: "cleaning-mop",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    description: "Complete wet mop set with bucket and wringer. Perfect for deep cleaning floors.",
    details: {
      "Brand": "AS Enterprises",
      "Bucket Capacity": "20 Liters",
      "Mop Material": "Cotton",
      "Handle": "Stainless Steel"
    }
  },
  {
    id: "8",
    slug: "microfiber-flat-mop",
    name: "Microfiber Flat Mop",
    category: "Cleaning Mops",
    categorySlug: "cleaning-mop",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80",
    description: "Professional microfiber flat mop for streak-free cleaning. Ideal for hardwood and tile floors.",
    details: {
      "Brand": "AS Enterprises",
      "Head Width": "45 cm",
      "Material": "Premium Microfiber",
      "Handle": "Aluminium Telescopic"
    }
  },
  // Tissue Paper & Napkins
  {
    id: "9",
    slug: "toilet-roll",
    name: "Toilet Roll",
    category: "Tissue Paper & Napkins",
    categorySlug: "tissue-paper-napkins",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&q=80",
    description: "Soft and absorbent toilet rolls for commercial and residential use. 2-ply for comfort.",
    details: {
      "Brand": "AS Enterprises",
      "Ply": "2-Ply",
      "Sheets": "200 per roll",
      "Pack": "12 rolls"
    }
  },
  {
    id: "10",
    slug: "bathroom-tissue",
    name: "Bathroom Tissue",
    category: "Tissue Paper & Napkins",
    categorySlug: "tissue-paper-napkins",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80",
    description: "Premium bathroom tissue with enhanced softness. Biodegradable and septic-safe.",
    details: {
      "Brand": "AS Enterprises",
      "Type": "Jumbo Roll",
      "Material": "Virgin Pulp"
    }
  },
  {
    id: "11",
    slug: "dinner-napkin",
    name: "Dinner Napkin",
    category: "Tissue Paper & Napkins",
    categorySlug: "tissue-paper-napkins",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80",
    description: "Elegant dinner napkins for restaurants and events. Available in white and colored options.",
    details: {
      "Brand": "AS Enterprises",
      "Size": "40x40 cm",
      "Ply": "2-Ply",
      "Pack": "100 pieces"
    }
  },
  {
    id: "12",
    slug: "facial-tissue-box",
    name: "Facial Tissue Box",
    category: "Tissue Paper & Napkins",
    categorySlug: "tissue-paper-napkins",
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80",
    description: "Soft facial tissues for sensitive skin. 3-ply with lotion for extra care.",
    details: {
      "Brand": "AS Enterprises",
      "Sheets": "100 per box",
      "Ply": "3-Ply"
    }
  },
  // Toilet Cleaners
  {
    id: "13",
    slug: "toilet-bowl-cleaner",
    name: "Toilet Bowl Cleaner",
    category: "Toilet Cleaners",
    categorySlug: "toilet-cleaners",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&q=80",
    description: "Powerful toilet bowl cleaner that removes tough stains and eliminates 99.9% germs.",
    details: {
      "Brand": "AS Enterprises",
      "Volume": "500ml",
      "Active Ingredient": "Hydrochloric Acid",
      "Fragrance": "Fresh Pine"
    }
  },
  {
    id: "14",
    slug: "toilet-rim-block",
    name: "Toilet Rim Block",
    category: "Toilet Cleaners",
    categorySlug: "toilet-cleaners",
    image: "https://images.unsplash.com/photo-1564429238535-f1acd72f6be0?w=500&q=80",
    description: "Long-lasting rim block for continuous cleaning and freshness with every flush.",
    details: {
      "Brand": "AS Enterprises",
      "Duration": "Up to 800 flushes",
      "Pack": "3 pieces"
    }
  },
  // Floor Cleaners
  {
    id: "15",
    slug: "marble-floor-cleaner",
    name: "Marble Floor Cleaner",
    category: "Floor Cleaners",
    categorySlug: "floor-cleaners",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500&q=80",
    description: "Specialized cleaner for marble floors that cleans without damaging the surface shine.",
    details: {
      "Brand": "AS Enterprises",
      "Volume": "5 Liters",
      "pH Level": "Neutral",
      "Usage": "Dilute 1:50"
    }
  },
  {
    id: "16",
    slug: "tile-floor-cleaner",
    name: "Tile Floor Cleaner",
    category: "Floor Cleaners",
    categorySlug: "floor-cleaners",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
    description: "Heavy-duty tile cleaner that removes grease, grime, and stubborn stains.",
    details: {
      "Brand": "AS Enterprises",
      "Volume": "5 Liters",
      "Type": "Concentrated"
    }
  },
  // Hand Dryers
  {
    id: "17",
    slug: "automatic-hand-dryer",
    name: "Automatic Hand Dryer",
    category: "Hand Dryers",
    categorySlug: "hand-dryers",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
    description: "High-speed automatic hand dryer with HEPA filter. Dries hands in 10-12 seconds.",
    details: {
      "Brand": "AS Enterprises",
      "Power": "1800W",
      "Drying Time": "10-12 seconds",
      "Noise Level": "78dB",
      "Warranty": "2 Years"
    }
  },
  {
    id: "18",
    slug: "jet-hand-dryer",
    name: "Jet Hand Dryer",
    category: "Hand Dryers",
    categorySlug: "hand-dryers",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80",
    description: "Commercial jet hand dryer with touchless operation and energy-efficient motor.",
    details: {
      "Brand": "AS Enterprises",
      "Power": "2100W",
      "Air Speed": "90 m/s",
      "Sensor": "Infrared"
    }
  }
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => p.categorySlug === categorySlug);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

export const getRelatedProducts = (currentSlug: string, categorySlug: string, limit = 4): Product[] => {
  return products
    .filter(p => p.categorySlug === categorySlug && p.slug !== currentSlug)
    .slice(0, limit);
};
