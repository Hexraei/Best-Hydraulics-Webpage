import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { IndustrialHeroSlideshow } from "@/components/industrial-hero-slideshow";
import { ProductCard } from "@/components/product-card";
import { HeroQuoteForm } from "@/components/hero-quote-form";
import { getCatalog } from "@/lib/catalog";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const categoryTiles = [
  {
    title: "Hydraulics",
    image: "/images/hydraulic.webp",
    description: "Hoses, pumps, couplers, and seal kits for service and plant maintenance.",
  },
  {
    title: "Pneumatics",
    image: "/images/pneumatic.webp",
    description: "Air cylinders, control valves, regulators, and tubing for automation.",
  },
  {
    title: "Industrial Rubber",
    image: "/images/rubber.webp",
    description: "Sheets, gaskets, and O-rings for sealing and vibration control.",
  },
];

const trustIndicators = [
  "ISO Certified Supplier",
  "5000+ Industrial Components",
  "Technical Support Available",
];

export default async function Home() {
  const catalog = await getCatalog();
  const featured = catalog.slice(0, 4);
  const categoryCount = new Set(catalog.map((product) => product.category)).size;

  const stats = [
    { value: `${catalog.length}+`, label: "Components Catalogued" },
    { value: `${categoryCount || 3}`, label: "Product Categories" },
    { value: "2017", label: "Supplying Since" },
    { value: "24 hr", label: "Typical RFQ Response" },
  ];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    foundingDate: "2017",
    areaServed: "IN",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tiruchirappalli",
      addressCountry: "IN",
    },
  };

  return (
    <div className="bg-slate-50/70">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0">
          <IndustrialHeroSlideshow />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.96)_18%,rgba(2,6,23,0.92)_34%,rgba(2,6,23,0.82)_48%,rgba(2,6,23,0.56)_66%,rgba(2,6,23,0.26)_84%,rgba(2,6,23,0.08)_94%,rgba(2,6,23,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_42%)]" />

        <div className="relative container z-10 flex min-h-[calc(100vh-4rem)] items-center py-16 lg:py-20">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/82">
                Proving Trust since 2017
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
                Best Hydraulics
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200/95 sm:text-base">
                We supply hydraulic, pneumatic, and industrial rubber components to maintenance teams and OEM
                buyers across India. Tell us the part you need, and we will source it, price it, and deliver it.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 bg-white px-6 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
                >
                  Browse Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[3px] border border-white/15 !bg-black px-6 text-sm font-medium !text-white transition-colors hover:bg-slate-900"
                >
                  Contact Us
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-6 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-slate-200/70">
                {trustIndicators.map((item, index) => (
                  <div key={item} className="flex items-center gap-5">
                    <span>{item}</span>
                    {index < trustIndicators.length - 1 ? <span className="h-1 w-1 shrink-0 rounded-full bg-slate-500/70" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <HeroQuoteForm />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="container space-y-24 pt-14 pb-20 lg:pt-16">
        <RevealOnScroll>
          <section id="industries" className="scroll-mt-24">
            <div className="mb-10 flex flex-col items-center gap-2.5 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Shop by Category
              </h2>
              <Link
                href="/products"
                className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
              >
                View all products →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {categoryTiles.map((category) => (
                <article
                  key={category.title}
                  className="group overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(category.title)}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 transition-colors duration-300 group-hover:bg-slate-950/10" />
                  </Link>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-1">
          <section id="testimonials" className="scroll-mt-24 text-center">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Trusted by hundreds of industrial buyers
              </h2>
            </div>

            <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
              {[
                {
                  name: "Ramesh K.",
                  initials: "RK",
                  role: "Plant Engineer, Pune",
                  text: "Got the exact hydraulic hose spec I needed. Delivered fast, no back-and-forth. Saved us a week of sourcing.",
                  stars: 5,
                  delay: "0s",
                  offset: "mt-0",
                },
                {
                  name: "Sunil M.",
                  initials: "SM",
                  role: "Maintenance Head, Chennai",
                  text: "Ordered O-ring kits in bulk. Fair pricing.",
                  stars: 5,
                  delay: "0.5s",
                  offset: "mt-6",
                },
                {
                  name: "Arvind T.",
                  initials: "AT",
                  role: "OEM Procurement, Coimbatore",
                  text: "Consistent quality across repeat orders. This is our go-to source for pneumatic parts now.",
                  stars: 5,
                  delay: "1s",
                  offset: "mt-0",
                },
                {
                  name: "Deepa R.",
                  initials: "DR",
                  role: "Purchase Manager, Ahmedabad",
                  text: "Quick RFQ response and no minimum order fuss.",
                  stars: 4,
                  delay: "1.5s",
                  offset: "mt-8",
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className={`review-float mb-5 break-inside-avoid rounded-[8px] border border-slate-200 bg-white p-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] ${review.offset}`}
                  style={{ animationDelay: review.delay }}
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < review.stars ? "text-amber-400" : "text-slate-200"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-slate-700">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[0.65rem] font-bold text-white">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-[0.78rem] font-semibold text-slate-900">{review.name}</p>
                      <p className="text-[0.68rem] text-slate-500">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-6 text-slate-500">
              We keep sourcing verified, fitment guidance practical, and our response fast, so industrial buyers get parts that work the first time.
            </p>
          </section>
        </RevealOnScroll>
        <RevealOnScroll delayClass="reveal-delay-1">
          <section id="mission" className="scroll-mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-slate-200 bg-slate-100 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Our Mission, industrial plant operations"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 to-transparent" />
            </div>
            <div className="space-y-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-400">Who we are</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Our Mission</h2>
              <div className="space-y-4 text-[0.96rem] leading-7 text-slate-600">
                <p>
                  We source every product through a verified supply chain, from hydraulic hoses and pressure fittings to pneumatic cylinders and industrial rubber seals, and hold each one to strict dimensional and material standards. Engineers run our team, not just salespeople, so our guidance comes from real application knowledge — including on-site hydraulic and pneumatic maintenance service.
                </p>
                <p>
                  Whether it&apos;s a single replacement part needed urgently or a scheduled bulk order for an OEM line, we treat both with the same care — no minimum order thresholds, transparent pricing, and no intermediary delays.
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-1">
          <section id="vision" className="scroll-mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-400">Where we&apos;re headed</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Our Vision</h2>
              <div className="space-y-4 text-[0.96rem] leading-7 text-slate-600">
                <p>
                  We want industrial buyers across India to get instant access to a verified, well-catalogued inventory of hydraulic, pneumatic, and rubber components, along with the technical documentation and fitment data that larger distributors have kept to themselves for years.
                </p>
                <p>
                  A maintenance head in Coimbatore and a procurement manager in Pune should get the same access, pricing transparency, and response time — so we keep investing in deeper catalogue coverage and faster logistics to make that true.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-slate-200 bg-slate-100 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="Our Vision, future of industrial sourcing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-slate-950/20 to-transparent" />
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-2">
          <section id="featured" className="scroll-mt-24">
            <div className="mb-10 flex flex-col items-center gap-2.5 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Featured Products
              </h2>
              <Link
                href="/contact"
                className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
              >
                Request quote →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </div>
  );
}
