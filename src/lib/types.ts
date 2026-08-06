export type VariantSpec = { name: string; value: string };

export type ProductVariant = {
  id: string;
  dimension: string;
  specs: VariantSpec[];
  price: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Hydraulics" | "Pneumatics" | "Industrial Rubber";
  family: string;
  description: string;
  tag: "In Stock" | "Out of Stock";
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  brand?: string;
  material?: string;
  pressureRating?: string;
  application?: string;
};

export type CartLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};
