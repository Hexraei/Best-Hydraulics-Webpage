import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { products, variants } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function int(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : NaN;
}

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

async function guard() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Not authorised" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ message: "No database configured." }, { status: 503 });
  }
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await guard();
  if (denied) return denied;

  const productId = Number((await params).id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const db = getDb();

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  // These columns are NOT NULL (family/description default to ""), so an empty
  // value must be saved as "", not null — unlike the nullable fields below.
  const requiredTextFields: [string, string, number][] = [
    ["name", "name", 250],
    ["category", "category", 80],
    ["family", "family", 120],
    ["description", "description", 5000],
  ];
  const nullableTextFields: [string, string, number][] = [
    ["brand", "brand", 120],
    ["material", "material", 120],
    ["pressureRating", "pressureRating", 60],
    ["application", "application", 120],
    ["partNumber", "partNumber", 120],
    ["hsnCode", "hsnCode", 20],
    ["image", "image", 1000],
  ];

  for (const [key, column, max] of requiredTextFields) {
    if (body[key] !== undefined) updates[column] = str(body[key], max);
  }
  for (const [key, column, max] of nullableTextFields) {
    if (body[key] !== undefined) updates[column] = str(body[key], max) || null;
  }

  if (body.published !== undefined) updates.published = body.published ? 1 : 0;
  if (Array.isArray(body.gallery)) {
    updates.gallery = (body.gallery as unknown[])
      .filter((url): url is string => typeof url === "string")
      .slice(0, 12);
  }

  await db.update(products).set(updates).where(eq(products.id, productId));

  // Variants are replaced wholesale when supplied: simpler and less error-prone
  // than diffing, and the admin form always submits the full set.
  if (Array.isArray(body.variants)) {
    const incoming = body.variants as Record<string, unknown>[];
    const clean = [];

    for (const [index, variant] of incoming.entries()) {
      const price = int(variant.price);
      const stock = int(variant.stock);
      const specs = cleanSpecs(variant.specs);

      if (specs.length === 0 || !Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { message: `Variant ${index + 1}: at least one field and a valid price are required` },
          { status: 400 },
        );
      }

      clean.push({
        productId,
        specs,
        sku: str(variant.sku, 120) || null,
        price,
        stock: Number.isFinite(stock) && stock >= 0 ? stock : 0,
        sortOrder: index,
      });
    }

    if (clean.length === 0) {
      return NextResponse.json(
        { message: "A product needs at least one variant" },
        { status: 400 },
      );
    }

    await db.delete(variants).where(eq(variants.productId, productId));
    await db.insert(variants).values(clean);
  }

  return NextResponse.json({ message: "Product updated" });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await guard();
  if (denied) return denied;

  const productId = Number((await params).id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
  }

  // Variants cascade via the foreign key.
  await getDb().delete(products).where(eq(products.id, productId));
  return NextResponse.json({ message: "Product deleted" });
}
