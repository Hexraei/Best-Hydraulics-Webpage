/**
 * Imports the built-in sample catalog into the database.
 *
 *   npm run db:seed
 *
 * Useful for trying the admin area before real product data exists. Skips
 * anything already present, so it is safe to re-run. Once real products are
 * entered you will not need this again.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { products as productsTable, variants as variantsTable } from "../src/db/schema";
import { products as sampleProducts } from "../src/lib/products";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema: { products: productsTable, variants: variantsTable } });

  let created = 0;
  let skipped = 0;

  for (const [index, product] of sampleProducts.entries()) {
    const [existing] = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.slug, product.slug))
      .limit(1);

    if (existing) {
      skipped++;
      continue;
    }

    const [row] = await db
      .insert(productsTable)
      .values({
        slug: product.slug,
        name: product.name,
        category: product.category,
        family: product.family,
        description: product.description,
        brand: product.brand ?? null,
        material: product.material ?? null,
        pressureRating: product.pressureRating ?? null,
        application: product.application ?? null,
        image: product.image,
        gallery: product.gallery,
        sortOrder: index,
      })
      .returning({ id: productsTable.id });

    await db.insert(variantsTable).values(
      product.variants.map((variant, variantIndex) => ({
        productId: row.id,
        specs: variant.specs,
        price: variant.price,
        stock: variant.stock,
        sortOrder: variantIndex,
      })),
    );

    created++;
  }

  console.log(`Seed complete — ${created} product(s) created, ${skipped} already present.`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
