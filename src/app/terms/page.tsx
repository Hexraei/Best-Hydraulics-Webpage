import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Payment terms, order confirmation, and supply conditions for purchases from Best Hydraulics.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50/70">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.94)_42%,rgba(2,6,23,0.86)_100%)]" />
        <div className="relative container py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/80">Store Policy</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">
              Please review our trade terms and conditions regarding industrial part sourcing and procurement.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl py-10 lg:py-12">
        <section className="rounded-[4px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
          <div className="space-y-6 text-slate-600 text-sm leading-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Request for Quote (RFQ) Flow</h2>
              <p className="mt-3">
                All cart items submitted via this storefront generate a pre-filled RFQ email. Sourcing requests do not constitute a binding contract of sale. Sourcing contracts are only finalized upon our explicit issue of a Performa Invoice (PI) or Sales Order (SO).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Pricing & Validity</h2>
              <p className="mt-3">
                Prices displayed on this storefront are indicative and subject to changes based on raw material fluctuations, duty tariffs, and variant specifications. Official quote prices are valid for 30 days from the date of issue unless specified otherwise.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Payment Terms</h2>
              <p className="mt-3">
                For standard catalog dispatch, 100% advance payment is required unless credit limits have been previously established with our accounts desk. Custom length hoses, custom EPDM sheets, or special material pneumatic valves require a 50% advance deposit before fabrication begins.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Limitations of Liability</h2>
              <p className="mt-3">
                Best Hydraulics shall not be held liable for indirect, incidental, or consequential damages (including plant downtime, loss of production, or machinery damage) arising out of standard operational fitment failure of any components sold. It is the buyer&apos;s engineering team&apos;s responsibility to verify compatibility before installation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">5. Governing Law & Jurisdiction</h2>
              <p className="mt-3">
                These terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or arbitration arising from trade interactions with Best Hydraulics shall be subject to the exclusive jurisdiction of the courts in Tiruchirappalli, Tamil Nadu.
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
