import type { VariantSpec } from "@/lib/types";

/**
 * Every variant field falls into one of these buckets, and the buckets always
 * render in this order: model, then any code, then the description, then any
 * other attribute, and finally the dimensions. Price is not a spec — it is
 * always the last column — so it has no rank here.
 *
 * Ordering is applied at render time rather than stored, so products added
 * later are laid out consistently without anyone having to reorder them.
 */
const SPEC_RANK = { model: 0, code: 1, description: 2, other: 3, dimension: 4 } as const;

function specRank(name: string) {
  const key = name.trim().toLowerCase();

  // "Model", "Model No.", "Model Number"
  if (/^model\b/.test(key)) return SPEC_RANK.model;

  // "HSN", "HSN Number", "Part Code", "Part No.", "Item Code", "Code", "SKU"
  if (/\b(hsn|code|sku)\b/.test(key) || /^(part|item)\b/.test(key)) return SPEC_RANK.code;

  if (/^(description|name)\b/.test(key)) return SPEC_RANK.description;

  // "Size", "Act. Size", "Length", "Bore", "Height", "Width", "Diameter", "OD/ID"
  if (/\b(size|length|bore|height|width|diameter|dimension|od|id)\b/.test(key)) {
    return SPEC_RANK.dimension;
  }

  // Type, Range, Voltage, Load Capacity, Material, Port, Bar, Differential, ...
  return SPEC_RANK.other;
}

/**
 * Column names for a product's variant table, in canonical order. Ties keep the
 * order the specs were entered in, so related fields stay grouped.
 */
export function orderedSpecNames(variants: { specs: VariantSpec[] }[]) {
  const names = Array.from(
    new Set(variants.flatMap((variant) => variant.specs.map((spec) => spec.name))),
  );

  return names
    .map((name, index) => ({ name, index, rank: specRank(name) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.name);
}

/** A single variant's specs in canonical column order. */
export function orderedSpecs(specs: VariantSpec[]) {
  return specs
    .map((spec, index) => ({ spec, index, rank: specRank(spec.name) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.spec);
}

/** Renders variant specs as "Range: 2-280 • Model No.: H-Guru" for compact display. */
export function specsLabel(specs: VariantSpec[]) {
  return orderedSpecs(specs)
    .map((spec) => `${spec.name}: ${spec.value}`)
    .join(" • ");
}

/**
 * Short identifier for a variant, for places with no room for the full spec
 * list (dropdown options, cart line headings). Uses the values alone, since the
 * field names are shown separately wherever this appears.
 */
export function variantLabel(specs: VariantSpec[]) {
  const label = orderedSpecs(specs)
    .map((spec) => spec.value)
    .filter(Boolean)
    .join(" • ");
  return label || "Standard";
}
