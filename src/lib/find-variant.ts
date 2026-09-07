import type { Product } from "@/types/product";

/**
 * Find the best matching variant for a product, based on selected options.
 * Returns the variant id or null if no suitable variant is found.
 */
export function findVariantId(
  product: Product,
  selectedOptions: Record<string, string>
): string | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  const choiceKeys = Object.keys(selectedOptions);

  if (choiceKeys.length === 0) return product.variants[0]?._id ?? null;

  const matchedVariant = product.variants.find((variant) =>
    choiceKeys.every((key) => variant.choices?.[key] === selectedOptions[key])
  );

  return matchedVariant?._id ?? null;
}
