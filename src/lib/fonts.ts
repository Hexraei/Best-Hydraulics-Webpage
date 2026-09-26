import { Saira } from "next/font/google";

// Saira Italic is the closest Google Font to the logo's wordmark: expanded width
// matches "BEST", semi-condensed matches "HYDRAULICS", light matches the tagline.
// Reserved for the logo wordmark (see DESIGN.md) — not a UI font.
export const logoFont = Saira({ subsets: ["latin"], style: "italic", axes: ["wdth"], display: "swap" });
