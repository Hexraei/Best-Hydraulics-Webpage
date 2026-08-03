import { Suspense } from "react";
import { CatalogFallback, ProductsCatalog } from "@/components/products-catalog";
import { getCatalog } from "@/lib/catalog";

// Products come from the database, so this route must not be baked at build time.
export const dynamic = "force-dynamic";

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
