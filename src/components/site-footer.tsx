import Link from "next/link";
import { contact, mapsUrl } from "@/lib/site";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M4.5 5.5c0 8.28 5.72 13.5 13 13.5l1.5-3.2-3.9-1.65-1.55 2.1c-2.55-.52-5.03-3-5.55-5.55l2.1-1.55L8.45 5.25 5.25 6.75C5 6.28 4.5 5.92 4.5 5.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <rect x="4.5" y="6" width="15" height="12" rx="1.5" />
      <path d="m5 7 7 6 7-6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="M5 20V4.5h9.5L19 9v11H5Z" />
      <path d="M14.5 4.5V9H19" />
      <path d="M8 20v-4h3v4" />
      <path d="M8 9h3" />
      <path d="M8 12h3" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="container grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="brand-font text-lg font-semibold text-white">Best Hydraulics</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            Industrial supply partner for hydraulics, pneumatics, and industrial rubber components with verified stock and technical support.
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-400">
            <p>GSTIN: 33ACGPN4781M1Z6</p>
            <p>Mon-Sat 9:30 AM - 9:00 PM • Sun 10:30 AM - 1:00 PM</p>
            <p>Friday closed 12:30 PM - 2:30 PM for prayer</p>
          </div>
          <div className="mt-5">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-none border border-white/15 bg-white px-4 text-sm font-medium !text-slate-950 transition-colors hover:bg-slate-100"
            >
              Request Quote
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Products</h4>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/products?category=Pneumatics">Pneumatics</Link>
            <Link href="/products?category=Hydraulics">Hydraulics</Link>
            <Link href="/products?category=Industrial%20Rubber">Industrial Rubber</Link>
            <Link href="/products">All Products</Link>
          </nav>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Support</h4>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/contact">Contact Us</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/shipping">Shipping & Returns</Link>
          </nav>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contact Us</h4>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            {contact.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`} className="flex items-center gap-3 transition-colors hover:text-white">
                <PhoneIcon />
                <span>{phone.display}</span>
              </a>
            ))}
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition-colors hover:text-white">
              <MailIcon />
              <span>{contact.email}</span>
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 transition-colors hover:text-white"
            >
              <BuildingIcon />
              <span className="leading-6">{contact.address}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container flex flex-col gap-3 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Best Hydraulics. All rights reserved.</div>
          <div>Providing reliable spare parts since 2017</div>
        </div>
      </div>
    </footer>
  );
}
