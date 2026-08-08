import type { Metadata } from "next";

// The cart is per-visitor, so it should never be indexed. This lives in a
// layout because cart/page.tsx is a client component and cannot export
// metadata. Noindex beats a robots.txt disallow here: the header links to
// /cart, and a blocked-but-linked URL can still surface as a bare result.
export const metadata: Metadata = {
  title: "Your Quote Cart",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
