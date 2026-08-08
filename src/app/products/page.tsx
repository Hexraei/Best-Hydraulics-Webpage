import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogFallback, ProductsCatalog } from "@/components/products-catalog";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Product Catalogue | Hydraulics, Pneumatics & Industrial Rubber",
  description:
    "Browse the Best Hydraulics catalogue of hydraulic hoses and fittings, pneumatic cylinders and valves, and industrial rubber products. Request a quote for bulk and OEM supply.",
  alternates: { canonical: "/products" },
};

// Products come from the database and change rarely (admin edits), so the page
// is cached and refreshed in the background rather than re-queried on every hit.
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getCatalog();

  // useSearchParams needs a Suspense boundary or the route opts out of static
  // prerendering and the production build fails.
  return (
    <Suspense fallback={<CatalogFallback />}>
      <ProductsCatalog products={products} />
    </Suspense>
  );
}
