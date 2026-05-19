import type { ReactNode } from "react";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <path d="M5.5 4.8c.3-.6 1-.9 1.7-.8l2.3.5c.6.1 1 .5 1.2 1.1l.7 2.3c.2.6 0 1.2-.4 1.6l-1.5 1.5c1 1.9 2.5 3.4 4.5 4.5l1.5-1.5c.4-.4 1-.6 1.6-.4l2.3.7c.6.2 1 .6 1.1 1.2l.5 2.3c.1.7-.2 1.4-.8 1.7-.8.4-1.8.6-3 .4-2.9-.4-5.7-1.9-8.2-4.4s-4-5.3-4.4-8.2c-.2-1.2 0-2.2.4-3Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.7]">
      <rect x="4.5" y="6" width="15" height="12" rx="1.5" />
      <path d="m5 7 7 6 7-6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-white stroke-[1.8]">
      <path d="M5 20V4.5h9.5L19 9v11H5Z" />
      <path d="M14.5 4.5V9H19" />
      <path d="M8 20v-4h3v4" />
      <path d="M8 9h3" />
      <path d="M8 12h3" />
    </svg>
  );
}

function ContactCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[4px] border border-slate-200 bg-slate-950 p-5 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const address =
    "Kasthuri Complex, No 6 Chann bazzar, Madurai Rd, Tharanallur, Tiruchirappalli, Tamil Nadu 620008";
  const mapsUrl = "https://maps.app.goo.gl/jcB8PWapZWv9ZVhK8";

  return (
    <div className="bg-slate-50/70">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.94)_42%,rgba(2,6,23,0.86)_100%)]" />
        <div className="relative container py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/80">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Industrial sourcing support, quotations, and dispatch coordination.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-200 sm:text-[0.98rem]">
              Reach out for procurement support, technical clarification, bulk pricing, or delivery planning across hydraulics,
              pneumatics, and industrial rubber supply.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[4px] border border-slate-200 bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Best Hydraulics</p>
            <h2 className="brand-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Providing reliable spare parts since 2006</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              We support industrial buyers, maintenance teams, and OEM sourcing with direct contact, practical response times, and
              straightforward procurement handling.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ContactCard title="Phone">
                <div className="space-y-3 text-sm text-slate-100">
                  <a href="tel:9994703528" className="flex items-center gap-3 transition-colors hover:text-white">
                    <PhoneIcon />
                    <span>9994703528</span>
                  </a>
                  <a href="tel:9443410833" className="flex items-center gap-3 transition-colors hover:text-white">
                    <PhoneIcon />
                    <span>94434 10833</span>
                  </a>
                  <a href="tel:9842575335" className="flex items-center gap-3 transition-colors hover:text-white">
                    <PhoneIcon />
                    <span>98425 75335</span>
                  </a>
                </div>
              </ContactCard>

              <ContactCard title="Email and GSTIN">
                <div className="space-y-3 text-sm text-slate-100">
                  <a href="mailto:alfaruberss@gmail.com" className="flex items-center gap-3 transition-colors hover:text-white">
                    <MailIcon />
                    <span>alfaruberss@gmail.com</span>
                  </a>
                  <p className="text-slate-300">GSTIN: 33AAGFR3877A1ZD</p>
                </div>
              </ContactCard>

              <div className="sm:col-span-2">
                <ContactCard title="Address">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-sm text-slate-100 transition-colors hover:text-white"
                  >
                    <BuildingIcon />
                    <span className="leading-6 text-white">{address}</span>
                  </a>
                </ContactCard>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[4px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-200/75">Operating hours</p>
              <p className="mt-3 text-lg font-semibold">Monday to Saturday</p>
              <p className="mt-1 text-sm text-slate-300">9:00 AM - 6:00 PM</p>
            </div>

            <div className="rounded-[4px] border border-slate-200 bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">What we handle</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Industrial quotations and bulk supply</li>
                <li>Hydraulic and pneumatic component sourcing</li>
                <li>Dispatch coordination and support follow-up</li>
                <li>Technical clarification for maintenance teams</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
