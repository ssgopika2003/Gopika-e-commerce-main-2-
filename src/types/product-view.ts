import type { ProductOption, VariantWithDetails } from "./product";

/**
 * ProductView — flat, serializable UI-friendly read model.
 *
 * Produced by `toProductView()` from a full `Product` domain object,
 * OR hydrated directly from a `cartItem.snapshot` (for cart items).
 *
 * Rules:
 *  - All money fields are plain `number` (no string decimals from DB)
 *  - No deep nesting — consumers never need optional-chain drilling
 *  - Serializable over the wire (no Date objects, etc.)
 */
export interface ProductView {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  /** Base (undiscounted) price */
  price: number;
  /** Effective selling price after discount */
  discountedPrice: number;
  currency: string;
  inStock: boolean;
  stockQuantity?: number;
  ribbon?: string;
  brand?: string;
  /** Full variant list — needed for option pickers, stock lookups */
  variants: VariantWithDetails[];
  /** Option definitions (Color, Size, etc.) */
  productOptions: ProductOption[];
}

/**
 * Minimal snapshot stored inside cartItem.snapshot.
 * Used to hydrate a CartItem without joining back to product/media tables.
 */
export interface CartItemSnapshot {
  name: string;
  imageUrl: string | null;
  price: number;
  sku: string;
  optionValues: Record<string, string>;
}
