"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useCart } from "@/components/cart-provider";
import { logoFont } from "@/lib/fonts";
import { primaryPhone } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M12 2.25A9.75 9.75 0 0 0 4.1 17.68L2.5 21.5l3.98-1.54A9.75 9.75 0 1 0 12 2.25Z"
        className="fill-current"
      />
      <path
        d="M8.25 8.75c.18-.3.46-.45.8-.45h.55c.22 0 .4.12.5.33l.72 1.82c.08.2.05.42-.08.55l-.46.47c-.12.12-.15.3-.06.47.28.55.88 1.32 1.66 2.03.78.7 1.58 1.23 2.1 1.47.18.09.38.08.52-.02l.58-.39c.18-.12.4-.12.56-.01l1.25.8c.2.13.28.39.2.63-.2.56-.6 1.07-1.17 1.34-.66.31-1.26.36-1.9.22-1.12-.24-2.62-.97-4.08-2.3-1.46-1.33-2.45-2.85-2.84-3.94-.25-.71-.24-1.38.03-2 .08-.18.18-.39.3-.62Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-white stroke-[1.55]">
      <path d="M5.5 4.8c.3-.6 1-.9 1.7-.8l2.3.5c.6.1 1 .5 1.2 1.1l.7 2.3c.2.6 0 1.2-.4 1.6l-1.5 1.5c1 1.9 2.5 3.4 4.5 4.5l1.5-1.5c.4-.4 1-.6 1.6-.4l2.3.7c.6.2 1 .6 1.1 1.2l.5 2.3c.1.7-.2 1.4-.8 1.7-.8.4-1.8.6-3 .4-2.9-.4-5.7-1.9-8.2-4.4s-4-5.3-4.4-8.2c-.2-1.2 0-2.2.4-3Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.6]">
      <path d="M4.5 5.5h2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h7.1a1.5 1.5 0 0 0 1.5-1.1l1.6-5.9H7.2" />
      <path d="M9.1 18.5a1 1 0 1 0 0 .1Z" />
      <path d="M16.8 18.5a1 1 0 1 0 0 .1Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.6]">
      <circle cx="11" cy="11" r="5.5" />
      <path d="M15.2 15.2 19 19" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.7]">
      {open ? (
        <path d="M6 6 18 18M18 6 6 18" strokeLinecap="round" />
      ) : (
        <>
          <path d="M4 7h16" strokeLinecap="round" />
          <path d="M4 12h16" strokeLinecap="round" />
          <path d="M4 17h16" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group relative inline-flex h-11 items-center px-3 text-sm font-medium tracking-[0.01em] text-slate-100/86 transition-colors hover:text-white"
    >
      <span>{label}</span>
      <span
        className={`absolute inset-x-3 bottom-1 h-px origin-left bg-white transition-transform duration-200 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

function ActionIconLink({
  href,
  label,
  toneClass,
  children,
  external,
}: {
  href: string;
  label: string;
  toneClass: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`group inline-flex h-11 w-11 items-center justify-center rounded-[4px] border text-white transition-all duration-200 ${toneClass}`}
    >
      {children}
    </Link>
  );
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact Us" },
  { href: "/cart", label: "Cart" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { lines, hydrated } = useCart();

  // The menu is stored with the route it was opened on, so a navigation closes
  // it during render — no effect and no extra render pass.
  const [menuState, setMenuState] = useState<{ open: boolean; path: string }>({
    open: false,
    path: pathname,
  });
  const menuOpen = menuState.open && menuState.path === pathname;
  const setMenuOpen = (open: boolean) => setMenuState({ open, path: pathname });

  // Suppressed until hydration so the server-rendered header (always an empty
  // cart) does not flash a stale count.
  const cartCount = hydrated ? lines.reduce((sum, line) => sum + line.quantity, 0) : 0;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/products") return pathname.startsWith("/products");
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950 text-white shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <div className="border-b border-slate-800/70">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center text-white">
            <span className={`${logoFont.className} text-[1.2rem] leading-none whitespace-nowrap uppercase sm:text-[1.4rem] lg:text-[1.6rem]`}>
              <span className="font-black text-brand-red-bright [font-stretch:125%]">Best</span>{" "}
              <span className="font-extrabold text-white [font-stretch:90%]">Hydraulics</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ActionIconLink
              href={`https://wa.me/91${primaryPhone}`}
              label="WhatsApp"
              external
              toneClass="border-emerald-500/30 bg-emerald-500 hover:bg-emerald-600 hover:border-emerald-400/50"
            >
              <WhatsAppIcon />
            </ActionIconLink>
            <ActionIconLink
              href={`tel:${primaryPhone}`}
              label="Call"
              toneClass="border-sky-500/30 bg-sky-950 hover:bg-sky-900 hover:border-sky-400/50"
            >
              <PhoneIcon />
            </ActionIconLink>
            <ActionIconLink
              href="/cart"
              label="Cart"
              toneClass="border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 relative"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.7rem] font-bold text-white shadow-sm ring-2 ring-slate-950">
                  {cartCount}
                </span>
              )}
            </ActionIconLink>
          </div>
        </div>
      </div>

      <div>
        <div className="container flex h-[4.5rem] items-center justify-between gap-4 py-1">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/10 bg-white/5 text-slate-100 transition-colors hover:bg-white/10 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>

          <nav aria-label="Main" className="hidden min-w-0 flex-wrap items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
            ))}
          </nav>

          <Link
            href="/products?focus=search"
            aria-label="Search catalog"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/10 bg-white/5 text-slate-100 transition-colors hover:bg-white/10"
          >
            <SearchIcon />
          </Link>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="border-t border-slate-800/70 bg-slate-950 md:hidden"
          >
            <div className="container flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex h-12 items-center border-b border-slate-800/50 text-sm font-medium transition-colors last:border-b-0 ${
                    isActive(item.href) ? "text-white" : "text-slate-100/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
