import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { BrandBadge } from "@/components/brand-badge";
import { formatINR } from "@/lib/currency";
import { getCatalogProductBySlug } from "@/lib/catalog";

// Same reasoning as the products list: cache and refresh in the background
// instead of hitting the database on every page view.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found - Best Hydraulics",
      description: "The requested industrial product was not found in our catalog.",
    };
  }

  return {
    title: `${product.name} | ${product.category} - Best Hydraulics`,
    description: `Buy ${product.name} (${product.family}). ${product.description} Sourcing spare parts for plant maintenance and OEM procurement.`,
    openGraph: {
      title: `${product.name} - Best Hydraulics`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

const applicationMap: Record<string, string[]> = {
  Hydraulics: ["Plant maintenance", "Machine tools", "Pressure transfer", "OEM assemblies"],
  Pneumatics: ["Automation lines", "Compressed air systems", "Actuation", "Assembly cells"],
  "Industrial Rubber": ["Sealing", "Vibration control", "Gaskets", "Wear protection"],
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) notFound();

  const basePrice = Math.min(...product.variants.map((variant) => variant.price));
  const applications = applicationMap[product.category] ?? [];
  const specColumns = Array.from(
    new Set(product.variants.flatMap((variant) => variant.specs.map((spec) => spec.name))),
  );

  return (
    <div className="bg-slate-50/70">
      <div className="container space-y-6 py-6 lg:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-slate-500">
          <Link href="/" className="transition-colors hover:text-slate-900">
            Home
          </Link>
          <span>•</span>
          <Link href="/products" className="transition-colors hover:text-slate-900">
            Products
          </Link>
          <span>•</span>
          <span className="text-slate-700">{product.category}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[4px] border border-slate-200 bg-slate-950">
          <div className="absolute inset-0">
            <Image src={product.image} alt={product.name} fill priority className="object-cover opacity-45" />
            <div className="absolute inset-0 bg-slate-950/65" />
          </div>

          <div className="relative px-6 py-8 lg:px-10 lg:py-10">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-200/90">
                {product.category} / {product.family}
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{product.name}</h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">{product.description}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <section className="space-y-6">
            <article className="relative overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
                <div className="relative aspect-[4/3] bg-white p-8">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-1">
                  {product.gallery.map((img) => (
                    <div key={img} className="relative aspect-[4/3] overflow-hidden bg-white p-4">
                      <Image src={img} alt={`${product.name} gallery`} fill className="object-contain p-2" />
                    </div>
                  ))}
                </div>
              </div>
              <BrandBadge brand={product.brand} size="lg" position="bottom" />
            </article>

            <article className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Technical overview
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    Procurement-ready product information
                  </h2>
                </div>
                <span className="rounded-[3px] border border-slate-200 bg-slate-50 px-3 py-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Verified component
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Applications
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {applications.map((item) => (
                      <span
                        key={item}
                        className="rounded-[3px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Delivery notes
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    <li>• Bulk pricing available on request</li>
                    <li>• Technical support available before order placement</li>
                    <li>• Inventory subject to variant selection</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Variant schedule
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    Size and pricing
                  </h2>
                </div>
                <p className="text-sm text-slate-600">Starting from {formatINR(basePrice)}</p>
              </div>

              <div className="mt-4 overflow-hidden rounded-[4px] border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-50 text-left text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Dimension</th>
                      {specColumns.map((column) => (
                        <th key={column} className="px-4 py-3">
                          {column}
                        </th>
                      ))}
                      <th className="px-4 py-3">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {product.variants.map((variant) => (
                      <tr key={variant.id} className="bg-white">
                        <td className="px-4 py-3 font-medium text-slate-900">{variant.dimension}</td>
                        {specColumns.map((column) => (
                          <td key={column} className="px-4 py-3 text-slate-600">
                            {variant.specs.find((spec) => spec.name === column)?.value ?? ""}
                          </td>
                        ))}
                        <td className="px-4 py-3 font-medium text-slate-900">{formatINR(variant.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <AddToCartPanel product={product} />

            <div className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Procurement support
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>Technical fitment review available before order confirmation.</li>
                <li>Bulk quotation and dispatch coordination for industrial buyers.</li>
                <li>Reliable sourcing for maintenance, OEM, and plant operations.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
