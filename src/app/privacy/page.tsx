import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50/70">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.94)_42%,rgba(2,6,23,0.86)_100%)]" />
        <div className="relative container py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/80">Store Policy</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">
              We respect your operational and business privacy. Read how we manage contact information.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl py-10 lg:py-12">
        <section className="rounded-[4px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
          <div className="space-y-6 text-slate-600 text-sm leading-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Information We Collect</h2>
              <p className="mt-3">
                This storefront collects basic identifier details when you fill out a Request for Quote (RFQ) or contact form. This includes your Name, Business Name, Phone Number, Email ID, and the details of requested spare parts.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. How We Use Your Data</h2>
              <p className="mt-3">
                The collected information is solely used to process and respond to your procurement requests, provide quotations, coordinate dispatches, and follow up regarding delivery logistics. We do not use your information for spam or unsolicited commercial newsletters.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Non-Sharing Policy</h2>
              <p className="mt-3">
                We do not sell, rent, or trade your contact information or procurement details to third parties. Sourcing lists and customized component specifications are treated with absolute confidentiality.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Data Integrity and Control</h2>
              <p className="mt-3">
                Since our primary RFQ flow redirects to your default mail application, your data remains within your email sent history. Any records stored on our sales servers are secured behind firewalls and accessible only to authorized sales agents. You may request deletion of your records by emailing us at any time.
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
