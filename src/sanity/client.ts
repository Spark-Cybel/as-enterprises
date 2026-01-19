import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "g3xfk7os",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

// Write client for mutations (uses token from environment)
export const writeClient = createClient({
  projectId: "g3xfk7os",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: import.meta.env.VITE_SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
