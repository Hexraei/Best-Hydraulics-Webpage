import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Dispatch timelines, freight options, and delivery coverage for Best Hydraulics orders across India.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="bg-slate-50/70">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.94)_42%,rgba(2,6,23,0.86)_100%)]" />
        <div className="relative container py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/80">Store Policy</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Shipping & Returns
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">
              Read about our dispatch timelines, shipping partners, pickup options, and returns policy.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl py-10 lg:py-12">
        <section className="rounded-[4px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
          <div className="space-y-6 text-slate-600 text-sm leading-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Dispatch Timelines</h2>
              <p className="mt-3">
                Ready-to-ship items are typically dispatched within 24 to 48 hours of payment confirmation; your quotation will confirm the expected dispatch date. Custom hose assemblies, specific variant machining, or vulcanized industrial rubber gaskets require additional processing time (usually 3 to 5 business days).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Shipping and Transport Partners</h2>
              <p className="mt-3">
                We coordinate freight deliveries across India. Heavy consignments (e.g. bulk rubber sheets, hydraulic power units) are dispatched via road logistics partners (e.g., TCI, VRL, Safexpress, or SRS). Light parcel components (e.g., fittings, quick disconnect couplers, pneumatic valves) are sent via express air courier services (DTDC, Professional Couriers, or Blue Dart).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Self-Collection (Ex-Godown / Pickup)</h2>
              <p className="mt-3">
                Contractors and local buyers are welcome to coordinate self-collection from our Tiruchirappalli godown. Please ensure you receive a &quot;Ready for Collection&quot; clearance note from your designated sales manager before sending transport.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Returns and Replacements</h2>
              <p className="mt-3">
                Due to the specific operational fitment nature of industrial spares, returns are only accepted in cases of manufacturer material defects or incorrect shipments. Notification of defects or incorrect items must be reported to our sales support within 7 days of delivery.
              </p>
              <p className="mt-2">
                Custom cut sheets, custom dimensions, crimped hoses, or special ordered items cannot be returned or refunded under any circumstances once processing has commenced.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 flex justify-end">
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-5 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
            >
              Back to Catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
