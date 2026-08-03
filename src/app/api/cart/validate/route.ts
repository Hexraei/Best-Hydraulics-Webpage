import { NextResponse } from "next/server";
import { resolveCatalogVariant } from "@/lib/catalog";
import { CartLineInput } from "@/lib/types";

export async function POST(request: Request) {
  let body: { lines?: CartLineInput[] };

  try {
    body = (await request.json()) as { lines?: CartLineInput[] };
  } catch {
    return NextResponse.json({ message: "Invalid cart payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray(body.lines)) {
    return NextResponse.json({ message: "Invalid cart payload" }, { status: 400 });
  }

  for (const line of body.lines) {
    if (!line || typeof line !== "object") {
      return NextResponse.json({ message: "Invalid cart line" }, { status: 400 });
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      return NextResponse.json({ message: "Quantity must be a whole number of at least 1" }, { status: 400 });
    }
    const resolved = await resolveCatalogVariant(line.productId, line.variantId);
    if (!resolved) {
      return NextResponse.json({ message: "Product or variant not found" }, { status: 404 });
    }

    const { product, variant } = resolved;
    if (line.quantity > variant.stock) {
      return NextResponse.json(
        { message: `Only ${variant.stock} units available for ${product.name}` },
        { status: 409 },
      );
    }
  }

  return NextResponse.json({ message: "Cart is valid for checkout handoff" });
}
