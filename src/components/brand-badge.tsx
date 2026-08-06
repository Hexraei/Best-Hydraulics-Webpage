import Image from "next/image";

const BRAND_LOGOS: Record<string, { src: string; bg: string }> = {
  TECHNO: { src: "/brands/techno.webp", bg: "bg-red-600" },
  FESTO: { src: "/brands/festo.webp", bg: "bg-white" },
  JANATICS: { src: "/brands/janatics.webp", bg: "bg-white" },
  POLYHOSE: { src: "/brands/polyhose.webp", bg: "bg-white" },
};

/** Small logo chip in the corner of a product thumbnail — informational only, no hover state. */
export function BrandBadge({
  brand,
  size = "sm",
  position = "top",
}: {
  brand?: string | null;
  size?: "sm" | "lg";
  position?: "top" | "bottom";
}) {
  if (!brand) return null;

  const logo = BRAND_LOGOS[brand.toUpperCase()];
  if (!logo) return null;

  const sizeClasses = size === "lg" ? "h-12 w-28 p-2" : "h-9 w-20 p-1.5";
  const positionClasses = position === "bottom" ? "bottom-2" : "top-2";

  return (
    <span
      className={`absolute right-2 ${positionClasses} z-10 flex items-center justify-center overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/5 ${sizeClasses} ${logo.bg}`}
    >
      <span className="relative h-full w-full">
        <Image src={logo.src} alt={brand} fill className="object-contain" sizes="112px" />
      </span>
    </span>
  );
}
