import type { Product } from "./product";
import type { ProductView } from "./product-view";

export interface CartItem {
  cartItemId: string;
  // snapshot-hydrated product view for display
  product: ProductView;
  variantId?: string;
  quantity: number;
  selectedOptions: Record<string, string>;
}

// Cart shape shared between backend API responses and frontend
export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// full Product needed — findVariant() requires variants/productOptions
export interface AddToCartValues {
  product: Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}
