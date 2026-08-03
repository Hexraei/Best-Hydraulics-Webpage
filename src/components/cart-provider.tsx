"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Product, ProductVariant } from "@/lib/types";

/**
 * Cart lines are self-contained: they carry the image, category, and the full
 * variant list rather than looking the product up at render time. Products now
 * come from the database, which a client component cannot query.
 */
type CartLine = {
  productId: string;
  productName: string;
  productSlug: string;
  category: string;
  image: string;
  variantId: string;
  dimension: string;
  quantity: number;
  unitPrice: number;
  options: ProductVariant[];
};

const STORAGE_KEY = "best-hydraulics-cart-v1";

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    typeof line.productName === "string" &&
    typeof line.variantId === "string" &&
    typeof line.dimension === "string" &&
    typeof line.quantity === "number" &&
    typeof line.unitPrice === "number" &&
    Array.isArray(line.options)
  );
}

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Prices shown here are advisory only — the server re-reads every price from
    // the catalog when the quote is submitted, so a stale cart cannot misquote.
    return parsed.filter(isCartLine).filter((line) => line.quantity > 0);
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  addToCart: (product: Product, variantId: string, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  updateVariant: (oldVariantId: string, newVariantId: string) => void;
  isVariantInCart: (variantId: string) => boolean;
  isProductInCart: (productId: string) => boolean;
  subtotal: number;
  clearCart: () => void;
  /** False until the persisted cart has been read on the client. */
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const emptySubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Reading localStorage in the initializer keeps the cart available on the very
  // first client render; on the server it returns [] to match the SSR output.
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);

  // False during SSR and the hydration render, true afterwards. Lets consumers
  // avoid rendering cart-dependent output that the server could not produce.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private browsing or a full quota: the cart still works for this session.
    }
  }, [lines, hydrated]);

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
          productSlug: product.slug,
          category: product.category,
          image: product.image,
          variantId,
          dimension: variant.dimension,
          quantity,
          unitPrice: variant.price,
          options: product.variants,
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
      const newVariant = source.options.find((variant) => variant.id === newVariantId);
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
        hydrated,
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

