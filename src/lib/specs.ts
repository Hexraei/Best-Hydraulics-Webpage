import type { VariantSpec } from "@/lib/types";

/** Renders variant specs as "Range: 2-280 • Model No.: H-Guru" for compact display. */
export function specsLabel(specs: VariantSpec[]) {
  return specs.map((spec) => `${spec.name}: ${spec.value}`).join(" • ");
}
