import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { products, variants } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VariantInput = {
  id?: number;
  specs?: unknown;
  sku?: unknown;
  price?: unknown;
  stock?: unknown;
};

function cleanSpecs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const spec = entry as Record<string, unknown>;
      const name = str(spec.name, 80);
      const specValue = str(spec.value, 200);
      return name && specValue ? { name, value: specValue } : null;
    })
    .filter((spec): spec is { name: string; value: string } => spec !== null)
    .slice(0, 20);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function int(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : NaN;
}

async function guard() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Not authorised" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json(
      { message: "No database configured. Set DATABASE_URL." },
      { status: 503 },
    );
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.id));
  const variantRows = await db
    .select()
    .from(variants)
    .orderBy(asc(variants.sortOrder), asc(variants.id));

  return NextResponse.json({
    products: rows.map((row) => ({
      ...row,
      variants: variantRows.filter((variant) => variant.productId === row.id),
    })),
  });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const name = str(body.name, 250);
  const category = str(body.category, 80);

  if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });
  if (!category) return NextResponse.json({ message: "Category is required" }, { status: 400 });

  const rawVariants = Array.isArray(body.variants) ? (body.variants as VariantInput[]) : [];
  if (rawVariants.length === 0) {
    return NextResponse.json(
      { message: "Add at least one variant — a product needs a price to be quoted." },
      { status: 400 },
    );
  }

  const cleanVariants = [];
  for (const [index, variant] of rawVariants.entries()) {
    const price = int(variant.price);
    const stock = int(variant.stock);
    const specs = cleanSpecs(variant.specs);

    if (specs.length === 0) {
      return NextResponse.json(
        { message: `Variant ${index + 1}: at least one field is required` },
        { status: 400 },
      );
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ message: `Variant ${index + 1}: invalid price` }, { status: 400 });
    }

    cleanVariants.push({
      specs,
      sku: str(variant.sku, 120) || null,
      price,
      stock: Number.isFinite(stock) && stock >= 0 ? stock : 0,
      sortOrder: index,
    });
  }

  const db = getDb();
  const requested = str(body.slug, 180) || slugify(name);

  // Slugs are unique and also the product URL, so resolve collisions rather than
  // rejecting — the owner should not have to invent one by hand.
  let slug = requested || `product-${Date.now()}`;
  for (let attempt = 2; ; attempt++) {
    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!existing) break;
    slug = `${requested}-${attempt}`;
  }

  const gallery = Array.isArray(body.gallery)
    ? (body.gallery as unknown[]).filter((url): url is string => typeof url === "string").slice(0, 12)
    : [];

  const [created] = await db
    .insert(products)
    .values({
      slug,
      name,
      category,
      family: str(body.family, 120),
      description: str(body.description, 5000),
      brand: str(body.brand, 120) || null,
      material: str(body.material, 120) || null,
      pressureRating: str(body.pressureRating, 60) || null,
      application: str(body.application, 120) || null,
      partNumber: str(body.partNumber, 120) || null,
      hsnCode: str(body.hsnCode, 20) || null,
      image: str(body.image, 1000) || gallery[0] || null,
      gallery,
      published: body.published === false ? 0 : 1,
    })
    .returning({ id: products.id });

  await db.insert(variants).values(
    cleanVariants.map((variant) => ({ ...variant, productId: created.id })),
  );

  return NextResponse.json({ message: "Product created", id: created.id, slug });
}
