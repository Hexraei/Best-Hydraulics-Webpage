"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { useCart } from "@/components/cart-provider";

function badgeClass(tag: Product["tag"]) {
  if (tag === "In Stock") return "badge badge-green";
  return "badge badge-orange";
}

function dimensionPreview(product: Product) {
  const unique = Array.from(
    new Set(
      product.variants
        .map((variant) => {
          const match = variant.dimension.match(/\d+\/\d+|\d+(\.\d+)?/);
          return match ? match[0] : "";
        })
        .filter(Boolean),
    ),
  ).slice(0, 3);
  return unique.length ? `${unique.join(", ")} etc.` : "-";
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isProductInCart } = useCart();
  const isAdded = isProductInCart(product.id);
  const minPrice = Math.min(...product.variants.map((variant) => variant.price));
  const dimensions = dimensionPreview(product);
  const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

  return (
    <article className="card p-3 flex flex-col gap-2.5">
      <div className="relative aspect-[4/2.5] overflow-hidden rounded-lg bg-slate-100">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
        <span className={`${badgeClass(product.tag)} absolute top-2 right-2 whitespace-nowrap shadow-md`}>{product.tag}</span>
      </div>
      <div className="flex items-start gap-2 mt-2">
        <h3 className="font-semibold text-sm text-slate-900 leading-snug">{product.name}</h3>
      </div>
      <p className="text-xs text-slate-600">{product.family}</p>
      <p className="text-xs text-slate-700"><strong>Dimensions:</strong> {dimensions}</p>
      <p className="text-xs text-slate-700"><strong>Status:</strong> {stock > 0 ? "In Stock" : "Out of Stock"}</p>
      <p className="text-slate-900 leading-none">
        <span className="text-xl font-extrabold">{formatINR(minPrice)}</span>{" "}
        <span className="text-xs text-slate-500 font-medium">onwards</span>
      </p>
      <div className="flex gap-2 mt-1">
        <Link href={`/products/${product.slug}`} className="btn-secondary text-xs">View Details</Link>
        {isAdded ? (
          <Link href="/cart" className="btn-primary text-xs">Go to Cart</Link>
        ) : (
          <button
            type="button"
            className="btn-primary text-xs cursor-pointer"
            onClick={() => addToCart(product, product.variants[0].id, 1)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
