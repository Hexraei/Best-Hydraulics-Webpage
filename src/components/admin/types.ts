export type AdminVariantSpec = { name: string; value: string };

export type AdminVariant = {
  id?: number;
  dimension: string;
  specs: AdminVariantSpec[];
  sku: string | null;
  price: number;
  stock: number;
};

export type AdminProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  family: string;
  description: string;
  brand: string | null;
  material: string | null;
  pressureRating: string | null;
  application: string | null;
  partNumber: string | null;
  hsnCode: string | null;
  image: string | null;
  gallery: string[];
  published: boolean;
  variants: AdminVariant[];
};

export type AdminQuote = {
  id: number;
  name: string;
  businessName: string | null;
  phoneNumber: string;
  emailId: string;
  message: string | null;
  lines: {
    productName: string;
    category: string;
    dimension: string;
    specs: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  emailDelivered: boolean;
  whatsappDelivered: boolean;
  createdAt: string;
};

export const CATEGORIES = ["Hydraulics", "Pneumatics", "Industrial Rubber"] as const;

export function emptyProduct(): AdminProduct {
  return {
    id: 0,
    slug: "",
    name: "",
    category: "Hydraulics",
    family: "",
    description: "",
    brand: null,
    material: null,
    pressureRating: null,
    application: null,
    partNumber: null,
    hsnCode: null,
    image: null,
    gallery: [],
    published: true,
    variants: [{ dimension: "", specs: [], sku: null, price: 0, stock: 0 }],
  };
}
