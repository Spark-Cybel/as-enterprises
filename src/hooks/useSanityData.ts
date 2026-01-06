import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/client";
import {
  allProductsQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  relatedProductsQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  allClientCategoriesQuery,
  clientsGroupedQuery,
  allArticlesQuery,
  articlesByCategoryQuery,
  articleBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/queries";

// Types
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface ProductDetail {
  key: string;
  value: string;
}

export interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: SanityImage;
  description?: string;
  details?: ProductDetail[];
}

export interface SanityCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: SanityImage;
}

export interface SanityClient {
  _id: string;
  name: string;
  logo: SanityImage;
}

export interface SanityClientCategory {
  _id: string;
  name: string;
  clients: SanityClient[];
}

export interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  categorySlug?: string;
  image?: SanityImage;
  content?: unknown[];
  publishedAt: string;
}

export interface WhyChooseUsPoint {
  title: string;
  description: string;
  icon: string;
}

export interface SanitySiteSettings {
  title?: string;
  description?: string;
  logo?: SanityImage;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  aboutTitle?: string;
  aboutContent?: unknown[];
  aboutImage?: SanityImage;
  whyChooseUsTitle?: string;
  whyChooseUsPoints?: WhyChooseUsPoint[];
}

// Products
export function useProducts() {
  return useQuery<SanityProduct[]>({
    queryKey: ["products"],
    queryFn: () => client.fetch(allProductsQuery),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery<SanityProduct | null>({
    queryKey: ["product", slug],
    queryFn: () => client.fetch(productBySlugQuery, { slug }),
    enabled: !!slug,
  });
}

export function useProductsByCategory(categorySlug: string | undefined) {
  return useQuery<SanityProduct[]>({
    queryKey: ["products", "category", categorySlug],
    queryFn: () => client.fetch(productsByCategoryQuery, { categorySlug }),
    enabled: !!categorySlug,
  });
}

export function useRelatedProducts(
  categorySlug: string | undefined,
  excludeSlug: string | undefined
) {
  return useQuery<SanityProduct[]>({
    queryKey: ["products", "related", categorySlug, excludeSlug],
    queryFn: () =>
      client.fetch(relatedProductsQuery, { categorySlug, excludeSlug }),
    enabled: !!categorySlug && !!excludeSlug,
  });
}

// Categories
export function useCategories() {
  return useQuery<SanityCategory[]>({
    queryKey: ["categories"],
    queryFn: () => client.fetch(allCategoriesQuery),
  });
}

export function useCategory(slug: string | undefined) {
  return useQuery<SanityCategory | null>({
    queryKey: ["category", slug],
    queryFn: () => client.fetch(categoryBySlugQuery, { slug }),
    enabled: !!slug,
  });
}

// Clients
export function useClientCategories() {
  return useQuery<SanityClientCategory[]>({
    queryKey: ["clientCategories"],
    queryFn: () => client.fetch(allClientCategoriesQuery),
  });
}

export function useClients() {
  return useQuery<SanityClientCategory[]>({
    queryKey: ["clients", "grouped"],
    queryFn: () => client.fetch(clientsGroupedQuery),
  });
}

// Articles
export function useArticles() {
  return useQuery<SanityArticle[]>({
    queryKey: ["articles"],
    queryFn: () => client.fetch(allArticlesQuery),
  });
}

export function useArticlesByCategory(categorySlug: string | undefined) {
  return useQuery<SanityArticle[]>({
    queryKey: ["articles", "category", categorySlug],
    queryFn: () => client.fetch(articlesByCategoryQuery, { categorySlug }),
    enabled: !!categorySlug,
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery<SanityArticle | null>({
    queryKey: ["article", slug],
    queryFn: () => client.fetch(articleBySlugQuery, { slug }),
    enabled: !!slug,
  });
}

// Site Settings
export function useSiteSettings() {
  return useQuery<SanitySiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: () => client.fetch(siteSettingsQuery),
  });
}
