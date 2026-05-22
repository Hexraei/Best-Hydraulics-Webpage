import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { IndustrialHeroSlideshow } from "@/components/industrial-hero-slideshow";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

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
  "Fast Dispatch Across India",
];

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

      <div className="container space-y-24 py-20">
        <RevealOnScroll>
          <section id="industries" className="scroll-mt-24">
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Shop by Category
              </h2>
              <Link href="/products" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                View all products →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {categoryTiles.map((category) => (
                <article
                  key={category.title}
                  className="overflow-hidden rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]"
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
                      className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 transition-colors duration-300 hover:bg-slate-950/10" />
                  </Link>
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
          <section id="testimonials" className="scroll-mt-24 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Trusted by hundreds of industrial buyers
            </h2>

            <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-4">
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
                  className={`review-float mb-5 break-inside-avoid rounded-[8px] border border-slate-200 bg-white px-5 py-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.07)] ${review.offset}`}
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

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-500">
              We keep the experience technical and operational: verified sourcing, practical fitment guidance, and a response style built for industrial buyers who need parts that work the first time.
            </p>
          </section>
        </RevealOnScroll>
        <RevealOnScroll delayClass="reveal-delay-1">
          <section id="mission" className="scroll-mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-slate-200 bg-slate-100 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Our Mission — industrial plant operations"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 to-transparent" />
            </div>
            <div className="space-y-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-400">Who we are</p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Our Mission</h2>
              <div className="space-y-4 text-[0.96rem] leading-7 text-slate-600">
                <p>
                  At Best Pneumatics, our mission is to be the most dependable industrial components partner for maintenance engineers, OEM procurement teams, and plant operations managers across India. We believe that the right part, arriving at the right time, is the difference between a plant running at capacity and one standing still.
                </p>
                <p>
                  We source every product through a verified supply chain — from hydraulic hoses and pressure fittings to pneumatic cylinders and industrial rubber seals — holding each to strict dimensional and material standards before it reaches your facility. Our team is built around engineers, not just salespeople, which means our guidance is grounded in real application knowledge.
                </p>
                <p>
                  Whether you need a single replacement part urgently or a scheduled bulk order for an OEM line, we treat both with the same operational rigour. No minimum order thresholds, no opaque pricing, and no intermediary delays.
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-1">
          <section id="vision" className="scroll-mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-400">Where we&apos;re headed</p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Our Vision</h2>
              <div className="space-y-4 text-[0.96rem] leading-7 text-slate-600">
                <p>
                  We envision a future where industrial buyers across India have instant access to a verified, intelligently catalogued inventory of hydraulic, pneumatic, and rubber components — with the technical documentation, fitment data, and procurement support that has historically been locked behind large distributor relationships.
                </p>
                <p>
                  Our long-term goal is to build the most trusted B2B industrial components platform in the country: one where a maintenance head in Coimbatore and a procurement manager in Pune both get the same level of access, pricing transparency, and response time previously reserved for enterprise accounts.
                </p>
                <p>
                  We are investing in deeper catalogue coverage, faster logistics partnerships, and technical support tools that make sourcing faster and more reliable — not just for today&apos;s buyers, but for the next generation of industrial operations.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-slate-200 bg-slate-100 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80"
                alt="Our Vision — future of industrial sourcing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-slate-950/20 to-transparent" />
            </div>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-2">
          <section id="brands" className="scroll-mt-24">
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Featured Products
              </h2>
              <Link href="/contact" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                Request quote →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
