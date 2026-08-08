/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the deployment environment
 * once the real domain is live so sitemap, robots, and OpenGraph tags emit
 * absolute URLs that point at production.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.besthydraulics.online").replace(/\/$/, "");

export const siteName = "Best Hydraulics";

export const siteDescription =
  "Industrial supply partner for hydraulics, pneumatics, and industrial rubber components. Browse the catalog and request a quote for plant maintenance, OEM sourcing, and bulk supply across India.";
