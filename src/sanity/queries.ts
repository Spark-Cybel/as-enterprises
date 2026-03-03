// Products
export const allProductsQuery = `*[_type == "product" && hide != true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  productCode,
  price,
  gstPercentage,
  description,
  details,
  hide
}`;

// All products including hidden (for invoice dropdown)
export const allProductsIncludingHiddenQuery = `*[_type == "product"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  productCode,
  price,
  gstPercentage,
  description,
  details,
  hide
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  productCode,
  price,
  gstPercentage,
  description,
  details,
  hide
}`;

export const productsByCategoryQuery = `*[_type == "product" && category->slug.current == $categorySlug && hide != true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  productCode,
  price,
  gstPercentage,
  description,
  details,
  hide
}`;

export const relatedProductsQuery = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $excludeSlug && hide != true][0...4] {
  _id,
  name,
  "slug": slug.current,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  description,
  hide
}`;

// Categories
export const allCategoriesQuery = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  image
}`;

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  image
}`;

// Client Categories
export const allClientCategoriesQuery = `*[_type == "clientCategory"] | order(order asc) {
  _id,
  name,
  order
}`;

// Clients (grouped by category)
export const allClientsQuery = `*[_type == "client"] {
  _id,
  name,
  logo,
  "category": category->name,
  "categoryOrder": category->order
} | order(categoryOrder asc, name asc)`;

export const clientsGroupedQuery = `*[_type == "clientCategory"] | order(order asc) {
  _id,
  name,
  "clients": *[_type == "client" && references(^._id)] {
    _id,
    name,
    logo
  }
}`;

// Articles
export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  publishedAt
}`;

export const articlesByCategoryQuery = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  publishedAt
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "category": category->name,
  "categorySlug": category->slug.current,
  image,
  content,
  publishedAt
}`;

// Site Settings
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  logo,
  phone,
  email,
  address,
  heroTitle,
  heroSubtitle,
  heroImage,
  aboutTitle,
  aboutContent,
  aboutImage,
  whyChooseUsTitle,
  whyChooseUsPoints
}`;
