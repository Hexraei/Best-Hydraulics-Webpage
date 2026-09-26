import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { FitToWidth } from "@/components/fit-to-width";
import { BrandBadge } from "@/components/brand-badge";
import { formatINR } from "@/lib/currency";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { orderedSpecNames, buildPriceGrid } from "@/lib/specs";

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
      title: { absolute: "Product Not Found | Best Hydraulics" },
      description: "The requested industrial product was not found in our catalog.",
      robots: { index: false, follow: true },
    };
  }

  // The root layout's title template appends the brand, so it is not repeated here.
  return {
    title: product.name,
    description: `Buy ${product.name}${product.family ? ` (${product.family})` : ""}. ${product.description} Sourcing spare parts for plant maintenance and OEM procurement.`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.name} - Best Hydraulics`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) notFound();

  const basePrice = Math.min(...product.variants.map((variant) => variant.price));
  // Model, then codes, then description, then dimensions — see orderedSpecNames.
  const specColumns = orderedSpecNames(product.variants);
  // Two-dimension products (e.g. Bore × Stroke) render as a compact price
  // matrix instead of one row per variant — some have hundreds of variants.
  const priceGrid = buildPriceGrid(product.variants);

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
            <Image src={product.image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
            <div className="absolute inset-0 bg-slate-950/65" />
          </div>

          <div className="relative px-6 py-8 lg:px-10 lg:py-10">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-200/90">
                {product.family ? `${product.category} / ${product.family}` : product.category}
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
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-1">
                  {product.gallery.map((img, index) => (
                    <div key={img} className="relative aspect-[4/3] overflow-hidden bg-white p-4">
                      <Image
                        src={img}
                        alt={`${product.name} — view ${index + 2}`}
                        fill
                        sizes="(max-width: 1024px) 33vw, 18vw"
                        className="object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <BrandBadge brand={product.brand} size="lg" position="bottom" />
            </article>

            <article className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Additional Details</h2>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Description
                  </p>
                  <p className={`mt-3 text-sm leading-6 ${product.description ? "text-slate-700" : "text-slate-400"}`}>
                    {product.description || "Not Available"}
                  </p>
                </div>

                <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Notes
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    <li>• Bulk pricing available on request</li>
                    <li>• Inventory subject to variant selection</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Size and pricing
                  </h2>
                </div>
                <p className="text-sm text-slate-600">Starting from {formatINR(basePrice)}</p>
              </div>

              <div className="mt-4 rounded-[4px] border border-slate-200">
                <FitToWidth>
                {priceGrid ? (
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-50 text-left text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
                      <tr>
                        <th className="h-14 w-28 bg-slate-50 p-0 normal-case">
                          <div className="relative h-14 w-28">
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(to top right, transparent calc(50% - 1px), #cbd5e1 calc(50% - 1px), #cbd5e1 calc(50% + 1px), transparent calc(50% + 1px))",
                              }}
                            />
                            <span className="absolute right-2 top-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
                              {priceGrid.columnAttribute}
                            </span>
                            <span className="absolute bottom-1.5 left-2 text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
                              {priceGrid.rowAttribute}
                            </span>
                          </div>
                        </th>
                        {priceGrid.columns.map((column) => (
                          <th key={column} className="whitespace-nowrap px-4 py-3 text-right">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {priceGrid.rows.map((row) => (
                        <tr key={row.rowValue} className="bg-white">
                          <td className="bg-white px-4 py-3 font-medium text-slate-900">
                            {row.rowValue}
                          </td>
                          {row.cells.map((price, index) => (
                            <td key={priceGrid.columns[index]} className="whitespace-nowrap px-4 py-3 text-right text-slate-600">
                              {price != null ? formatINR(price) : <span className="text-slate-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-50 text-left text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
                      <tr>
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
                )}
                </FitToWidth>
              </div>
            </article>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <AddToCartPanel product={product} />

            <div className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Product Details
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "HSN Code", value: product.hsnCode },
                  { label: "Part Number", value: product.partNumber },
                  { label: "Material", value: product.material },
                  { label: "Pressure Rating", value: product.pressureRating },
                  { label: "Application", value: product.application },
                ].map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <dt className="text-slate-500">{detail.label}</dt>
                    <dd className={detail.value ? "font-medium text-slate-900" : "text-slate-400"}>
                      {detail.value || "Not Available"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
