export type VariantSpec = { name: string; value: string };

export type ProductVariant = {
  id: string;
  specs: VariantSpec[];
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Hydraulics" | "Pneumatics" | "Industrial Rubber";
  family: string;
  description: string;
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  brand?: string;
  material?: string;
  pressureRating?: string;
  application?: string;
  partNumber?: string;
  hsnCode?: string;
  /** ISO timestamp of the last admin edit. Absent for the static seed catalog. */
  updatedAt?: string;
};

export type CartLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};
