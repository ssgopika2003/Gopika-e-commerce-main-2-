import type { Product } from "@/types/product";
import type { ProductView } from "@/types/product-view";

/**
 * toProductView
 *
 * Single source of truth for converting a `Product` (Wix-like domain object,
 * as returned by `getProductBySlug`) into a flat `ProductView` safe for all
 * UI consumers (cart, checkout, product details, listings).
 *
 * Never call product.priceData / product.media outside this function.
 */
export function toProductView(product: Product): ProductView {
  const price = product.priceData?.price ?? 0;
  const discountedPrice = product.priceData?.discountedPrice ?? price;

  const imageUrl =
    product.media?.mainMedia?.image?.url ??
    product.media?.items?.[0]?.image?.url ??
    null;

  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    imageUrl,
    price,
    discountedPrice,
    currency: product.priceData?.currency ?? "INR",
    inStock: product.stock?.inStock ?? true,
    stockQuantity: product.stock?.quantity,
    ribbon: product.ribbon ?? undefined,
    brand: product.brand ?? undefined,
    variants: product.variants ?? [],
    productOptions: product.productOptions ?? [],
  };
}

/**
 * productViewFromSnapshot
 *
 * Builds a minimal ProductView from data stored in `cartItem.snapshot`.
 * This is a fast path used by the cart GET route — no DB joins needed.
 * Fields that aren't stored in the snapshot (variants, productOptions, stock)
 * are given safe defaults because the cart display only needs name/image/price.
 */
export function productViewFromSnapshot(
  productId: string,
  slug: string,
  snapshot: {
    name: string;
    imageUrl: string | null;
    price: number;
    sku: string;
    optionValues: Record<string, string>;
  }
): ProductView {
  return {
    id: productId,
    name: snapshot.name,
    slug,
    imageUrl: snapshot.imageUrl,
    price: snapshot.price,
    discountedPrice: snapshot.price,
    currency: "INR",
    inStock: true,
    stockQuantity: undefined,
    ribbon: undefined,
    brand: undefined,
    variants: [],
    productOptions: [],
  };
}
