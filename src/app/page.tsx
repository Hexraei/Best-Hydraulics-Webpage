import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { IndustrialHeroSlideshow } from "@/components/industrial-hero-slideshow";
import { formatINR } from "@/lib/currency";
import { products } from "@/lib/products";

const categoryTiles = [
  {
    title: "Hydraulics",
    image: "/images/hydraulic-pump.svg",
    description: "Hoses, pumps, couplers, and seal kits for service and plant maintenance.",
  },
  {
    title: "Pneumatics",
    image: "/images/pneumatic-valve.svg",
    description: "Valves, cylinders, tubes, and fittings for automation and assembly lines.",
  },
  {
    title: "Industrial Rubber",
    image: "/images/rubber-gasket.svg",
    description: "Sheets, gaskets, and sealing products for industrial environments.",
  },
];

const trustIndicators = [
  "ISO Certified Supplier",
  "5000+ Industrial Components",
  "Technical Support Available",
  "Fast Dispatch Across India",
];

function categoryImage(category: string) {
  if (category === "Hydraulics") return "/images/hydraulic-hose.svg";
  if (category === "Pneumatics") return "/images/pneumatic-cylinder.svg";
  return "/images/rubber-sheet.svg";
}

function HomeProductCard({ product }: { product: (typeof products)[number] }) {
  const minPrice = Math.min(...product.variants.map((variant) => variant.price));

  return (
    <article className="overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={categoryImage(product.category)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-h-[14rem] flex-col p-4">
        <div className="space-y-1.5">
          <h3 className="text-[1rem] font-semibold leading-[1.35] text-slate-950">{product.name}</h3>
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
            {product.category} / {product.family}
          </p>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-500">From</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-xl font-semibold tracking-tight text-slate-950">{formatINR(minPrice)}</p>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-4 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <div className="bg-slate-50/70">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0">
          <IndustrialHeroSlideshow />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.96)_18%,rgba(2,6,23,0.92)_34%,rgba(2,6,23,0.82)_48%,rgba(2,6,23,0.56)_66%,rgba(2,6,23,0.26)_84%,rgba(2,6,23,0.08)_94%,rgba(2,6,23,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_42%)]" />

        <div className="relative container z-10 flex min-h-[calc(100vh-4rem)] items-center py-16 lg:py-20">
          <div className="w-full max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/82">
              Proving Trust since 2006
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Reliable industrial components for hydraulics, pneumatics, and plant operations.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">
              Verified industrial inventory, technical support, and fast dispatch for maintenance teams, OEM buyers,
              and procurement operations across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 !bg-black px-5 text-sm font-medium !text-white transition-colors hover:bg-slate-900"
              >
                Request Quote
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/10 pt-6 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-slate-200/78">
              {trustIndicators.map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <span>{item}</span>
                  {index < trustIndicators.length - 1 ? <span className="h-1 w-1 rounded-full bg-slate-500/80" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-14 py-14">
        <RevealOnScroll>
          <section id="industries" className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Core categories
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Built for plant maintenance and OEM sourcing
                </h2>
              </div>
              <Link href="/products" className="text-sm font-semibold text-slate-900">
                View all products
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {categoryTiles.map((category) => (
                <article
                  key={category.title}
                  className="overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-950">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-1">
          <div id="support" className="scroll-mt-24" />
          <section id="about" className="scroll-mt-24 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-slate-200 bg-slate-100">
              <Image
                src="/images/fitting-set.svg"
                alt="Industrial support and fittings"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Why buyers trust us
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Structured support for reliability, compatibility, and fast turnaround.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                We keep the experience technical and operational: verified sourcing, practical fitment guidance, and a response
                style built for industrial buyers who need parts that work the first time.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Verified stock",
                  "Fitment guidance",
                  "Bulk support",
                ].map((item) => (
                  <div key={item} className="rounded-[4px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-2">
          <section id="brands" className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Featured premium products
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Selected products with the same catalog discipline
                </h2>
              </div>
              <Link href="/contact" className="text-sm font-semibold text-slate-900">
                Request quote
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-2">
          <section className="rounded-[4px] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-200/80">
                  Procurement ready
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Need help sourcing parts for a plant, service team, or OEM line?
                </h2>
              </div>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 bg-white px-5 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
              >
                Request Quote
              </Link>
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </div>
  );
}
