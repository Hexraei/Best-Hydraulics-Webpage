import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Catalog | Best Hydraulics",
  description: "Browse our premium industrial catalog of hydraulic components, pneumatic valves, fittings, and industrial rubber sheets. Request quotes online.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
