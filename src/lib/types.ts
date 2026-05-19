export type ProductVariant = {
  id: string;
  dimension: string;
  color: string;
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
};

export type CartLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};
