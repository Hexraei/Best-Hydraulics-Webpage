import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { CartLineInput } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { lines?: CartLineInput[] };

  if (!body.lines || !Array.isArray(body.lines)) {
    return NextResponse.json({ message: "Invalid cart payload" }, { status: 400 });
  }

  for (const line of body.lines) {
    if (line.quantity < 1) {
      return NextResponse.json({ message: "Quantity must be at least 1" }, { status: 400 });
    }
    const product = getProductById(line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);
    if (!product || !variant) {
      return NextResponse.json({ message: "Product or variant not found" }, { status: 404 });
    }
    if (line.quantity > variant.stock) {
      return NextResponse.json(
        { message: `Only ${variant.stock} units available for ${product.name}` },
        { status: 409 },
      );
    }
  }

  return NextResponse.json({ message: "Cart is valid for checkout handoff" });
}
