import { Suspense } from "react";
import { CatalogFallback, ProductsCatalog } from "@/components/products-catalog";
import { getCatalog } from "@/lib/catalog";

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
