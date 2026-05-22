"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { getProductById } from "@/lib/products";

type CartLine = {
  productId: string;
  productName: string;
  variantId: string;
  dimension: string;
  quantity: number;
  unitPrice: number;
};

type CartContextValue = {
  lines: CartLine[];
  addToCart: (product: Product, variantId: string, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  updateVariant: (oldVariantId: string, newVariantId: string) => void;
  isVariantInCart: (variantId: string) => boolean;
  isProductInCart: (productId: string) => boolean;
  subtotal: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addToCart = (product: Product, variantId: string, quantity: number) => {
    const variant = product.variants.find((item) => item.id === variantId);
    if (!variant || quantity < 1) return;

    setLines((prev) => {
      const existing = prev.find((line) => line.variantId === variantId);
      if (existing) {
        return prev.map((line) =>
          line.variantId === variantId ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          variantId,
          dimension: variant.dimension,
          quantity,
          unitPrice: variant.price,
        },
      ];
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((line) => (line.variantId === variantId ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const updateVariant = (oldVariantId: string, newVariantId: string) => {
    setLines((prev) => {
      const source = prev.find((line) => line.variantId === oldVariantId);
      if (!source || oldVariantId === newVariantId) return prev;
      const product = getProductById(source.productId);
      const newVariant = product?.variants.find((variant) => variant.id === newVariantId);
      if (!newVariant) return prev;

      const withoutSource = prev.filter((line) => line.variantId !== oldVariantId);
      const targetExisting = withoutSource.find((line) => line.variantId === newVariantId);
      if (targetExisting) {
        return withoutSource.map((line) =>
          line.variantId === newVariantId
            ? { ...line, quantity: line.quantity + source.quantity }
            : line,
        );
      }
      return [
        ...withoutSource,
        {
          ...source,
          variantId: newVariant.id,
          dimension: `${newVariant.dimension} • ${newVariant.color}`,
          unitPrice: newVariant.price,
        },
      ];
    });
  };

  const isVariantInCart = (variantId: string) => lines.some((line) => line.variantId === variantId);
  const isProductInCart = (productId: string) => lines.some((line) => line.productId === productId);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );

  const clearCart = () => {
    setLines([]);
  };

  return (
    <CartContext.Provider
      value={{
        lines,
        addToCart,
        updateQuantity,
        updateVariant,
        isVariantInCart,
        isProductInCart,
        subtotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

