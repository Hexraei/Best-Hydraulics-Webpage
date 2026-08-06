"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";
import { formatINR } from "@/lib/currency";
import { specsLabel } from "@/lib/specs";

export function AddToCartPanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isVariantInCart } = useCart();

  const selected = product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];

  const isAdded = selected ? isVariantInCart(selected.id) : false;

  return (
    <div className="overflow-hidden rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="space-y-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Select dimension</p>
          <select
            className="mt-2 w-full rounded-[3px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.specs.length ? `${variant.dimension} • ${specsLabel(variant.specs)}` : variant.dimension}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-[4px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-slate-500">Price</p>
          <p className="text-right font-semibold text-slate-950">{selected ? formatINR(selected.price) : "-"}</p>
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Quantity</p>
          <input
            type="number"
            min={1}
            max={selected?.stock ?? 1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-2 w-full rounded-[3px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </div>

        {isAdded ? (
          <Link
            href="/cart"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-4 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
          >
            Go to Cart
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-4 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
            onClick={() => selected && addToCart(product, selected.id, Math.max(1, quantity))}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
