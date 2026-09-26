import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { BrandBadge } from "@/components/brand-badge";

export function ProductCard({ product }: { product: Product }) {
  const minPrice = Math.min(...product.variants.map((variant) => variant.price));

  return (
    <article className="flex flex-col overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-white p-6">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-2 transition-transform duration-500 ease-out hover:scale-105"
        />
        <BrandBadge brand={product.brand} />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-1.5 pb-3">
          <h3 className="text-[1.02rem] font-semibold leading-[1.35] text-slate-900">{product.name}</h3>
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
            {product.family ? `${product.category} / ${product.family}` : product.category}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-200 pt-3">
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
