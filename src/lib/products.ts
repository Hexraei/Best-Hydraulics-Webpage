import { Product } from "@/lib/types";

const imagePool = [
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580906855283-3c781e3f6f96?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601972602288-3be527b4f18f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581579438747-104c53d7fbc3?auto=format&fit=crop&w=1200&q=80",
];

const families = {
  Hydraulics: [
    "Hydraulic Pressure Hose",
    "Hydraulic Gear Pump",
    "Hydraulic Quick Coupler",
    "Hydraulic Control Valve",
    "Hydraulic Cylinder Seal Kit",
  ],
  Pneumatics: [
    "Pneumatic Air Cylinder",
    "Pneumatic Solenoid Valve",
    "FRL Air Preparation Unit",
    "Pneumatic PU Tube",
    "Pneumatic Fitting Set",
  ],
  "Industrial Rubber": [
    "Nitrile Rubber Sheet",
    "EPDM Rubber Roll",
    "Industrial Rubber Gasket",
    "Rubber O-Ring Kit",
    "Rubber Expansion Joint",
  ],
} as const;

function createVariants(productIndex: number) {
  const base = 850 + productIndex * 95;
  return [
    {
      id: `var-${productIndex + 1}-a`,
      specs: [
        { name: "Size", value: "Small / 1/4 in" },
        { name: "Color", value: "Black" },
      ],
      price: base,
      stock: 20 + (productIndex % 14),
    },
    {
      id: `var-${productIndex + 1}-b`,
      specs: [
        { name: "Size", value: "Medium / 3/8 in" },
        { name: "Color", value: "Blue" },
      ],
      price: base + 240,
      stock: 14 + (productIndex % 10),
    },
    {
      id: `var-${productIndex + 1}-c`,
      specs: [
        { name: "Size", value: "Large / 1/2 in" },
        { name: "Color", value: "Red" },
      ],
      price: base + 520,
      stock: 9 + (productIndex % 7),
    },
  ];
}

const categories: Product["category"][] = ["Hydraulics", "Pneumatics", "Industrial Rubber"];

export const products: Product[] = Array.from({ length: 50 }, (_, index) => {
  const category = categories[index % categories.length];
  const familyList = families[category];
  const family = familyList[index % familyList.length];
  const itemNumber = index + 1;
  const slugBase = `${family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${itemNumber}`;
  const imgA = imagePool[index % imagePool.length];
  const imgB = imagePool[(index + 3) % imagePool.length];
  const imgC = imagePool[(index + 6) % imagePool.length];
  const variants = createVariants(index);

  const brands = ["Best Hydraulics", "OEM Compatible", "Industrial Grade"];
  const materials = ["Nitrile", "EPDM", "Polyurethane", "Steel", "Rubber"];
  const pressures = ["10 bar", "16 bar", "25 bar", "40 bar", "63 bar"];
  const applications = ["Plant Maintenance", "OEM Assembly", "Machine Shop", "Fabrication", "Automation"];

  return {
    id: `prd-${itemNumber.toString().padStart(3, "0")}`,
    slug: slugBase,
    name: `${family} Pro Series ${itemNumber}`,
    category,
    family,
    description:
      "Industrial-grade spare part designed for demanding plant operations. Multiple dimensions, materials, and performance specifications are available for fitment flexibility.",
    tag: variants.some((variant) => variant.stock > 0) ? "In Stock" : "Out of Stock",
    image: imgA,
    gallery: [imgA, imgB, imgC],
    variants,
    brand: brands[index % brands.length],
    material: materials[index % materials.length],
    pressureRating: pressures[index % pressures.length],
    application: applications[index % applications.length],
  };
});

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(productId: string) {
  return products.find((product) => product.id === productId);
}
