import { asc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { products as productsTable, variants as variantsTable } from "@/db/schema";
import { products as staticProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

type ProductRow = typeof productsTable.$inferSelect;
type VariantRow = typeof variantsTable.$inferSelect;

const FALLBACK_IMAGE = "/images/hero-catalog.jpg";

function toProduct(row: ProductRow, rows: VariantRow[]): Product {
  const variants = rows.map((variant) => ({
    id: String(variant.id),
    dimension: variant.dimension,
    specs: variant.specs,
    price: variant.price,
    stock: variant.stock,
  }));

  const gallery = row.gallery?.length ? row.gallery : [];
  const image = row.image || gallery[0] || FALLBACK_IMAGE;

  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    family: row.family,
    description: row.description,
    tag: variants.some((variant) => variant.stock > 0) ? "In Stock" : "Out of Stock",
    image,
    gallery: gallery.length ? gallery : [image],
    variants,
    brand: row.brand ?? undefined,
    material: row.material ?? undefined,
    pressureRating: row.pressureRating ?? undefined,
    application: row.application ?? undefined,
  };
}

function groupVariants(variantRows: VariantRow[]) {
  const byProduct = new Map<number, VariantRow[]>();
  for (const variant of variantRows) {
    const list = byProduct.get(variant.productId);
    if (list) list.push(variant);
    else byProduct.set(variant.productId, [variant]);
  }
  return byProduct;
}

/**
 * All published products.
 *
 * Falls back to the static catalog whenever the database is unconfigured,
 * unreachable, or still empty — a storefront that 500s because a migration has
 * not run yet is worse than one showing the seed catalog.
 */
export async function getCatalog(): Promise<Product[]> {
  if (!hasDatabase()) return staticProducts;

  try {
    const db = getDb();

    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.published, 1))
      .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));

    if (rows.length === 0) return staticProducts;

    const variantRows = await db
      .select()
      .from(variantsTable)
      .orderBy(asc(variantsTable.sortOrder), asc(variantsTable.id));

    const byProduct = groupVariants(variantRows);

    // A product with no variants has no price, so it cannot be quoted.
    return rows
      .map((row) => toProduct(row, byProduct.get(row.id) ?? []))
      .filter((product) => product.variants.length > 0);
  } catch (error) {
    console.error("[catalog] falling back to static products:", error);
    return staticProducts;
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | undefined> {
  if (!hasDatabase()) return staticProducts.find((product) => product.slug === slug);

  try {
    const db = getDb();

    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);

    if (!row) return staticProducts.find((product) => product.slug === slug);

    const variantRows = await db
      .select()
      .from(variantsTable)
      .where(eq(variantsTable.productId, row.id))
      .orderBy(asc(variantsTable.sortOrder), asc(variantsTable.id));

    if (variantRows.length === 0) return undefined;
    return toProduct(row, variantRows);
  } catch (error) {
    console.error("[catalog] slug lookup failed, using static products:", error);
    return staticProducts.find((product) => product.slug === slug);
  }
}

/**
 * Resolves a product/variant pair for cart and RFQ validation, so prices are
 * always read from the source of truth rather than trusted from the client.
 */
export async function resolveCatalogVariant(productId: string, variantId: string) {
  const catalog = await getCatalog();
  const product = catalog.find((item) => item.id === productId);
  const variant = product?.variants.find((item) => item.id === variantId);
  return product && variant ? { product, variant } : null;
}
