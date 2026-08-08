import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

// Picks up newly added products without waiting for a redeploy.
export const revalidate = 3600;

/**
 * Hand-maintained edit dates for the static pages. A `lastModified` that moves
 * on every build tells crawlers nothing, so bump the relevant entry only when
 * the page content actually changes.
 */
const STATIC_ROUTES = [
  { path: "/", lastModified: "2026-08-08", changeFrequency: "weekly", priority: 1 },
  { path: "/products", lastModified: "2026-08-09", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", lastModified: "2026-08-09", changeFrequency: "monthly", priority: 0.8 },
  { path: "/shipping", lastModified: "2026-08-08", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", lastModified: "2026-08-08", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", lastModified: "2026-08-08", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** Fallback date for products that predate `updatedAt` tracking. */
const CATALOG_EPOCH = "2026-08-01";

/** Product images mix relative paths with absolute Blob URLs, so resolve both. */
function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    const images = [product.image, ...product.gallery].filter(Boolean);

    return {
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt ?? CATALOG_EPOCH),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: [...new Set(images)].map(absoluteUrl),
    };
  });

  return [...staticRoutes, ...productRoutes];
}
