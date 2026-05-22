"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";

export function getCategoryImage(category: string) {
  if (category === "Hydraulics") return "/images/hydraulic-hose.svg";
  if (category === "Pneumatics") return "/images/pneumatic-cylinder.svg";
  return "/images/rubber-sheet.svg";
}

interface ProductCardProps {
  product: Product;
  useCategoryImage?: boolean;
}

export function ProductCard({ product, useCategoryImage = false }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((variant) => variant.price));
  const imageSrc = useCategoryImage ? getCategoryImage(product.category) : product.image;

  return (
    <article className="flex flex-col overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-1.5">
          <h3 className="text-[1.02rem] font-semibold leading-[1.35] text-slate-900">{product.name}</h3>
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
            {product.category} / {product.family}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-200 pt-4">
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-500">From</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{formatINR(minPrice)}</p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-300 bg-slate-950 px-4 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
