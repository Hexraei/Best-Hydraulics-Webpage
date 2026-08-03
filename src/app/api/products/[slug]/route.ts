import { NextResponse } from "next/server";
import { getCatalogProductBySlug } from "@/lib/catalog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
