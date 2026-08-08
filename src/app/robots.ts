import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here is useful in search results: /cart is per-visitor and
        // /admin is the private product manager.
        disallow: ["/api/", "/cart", "/admin"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
