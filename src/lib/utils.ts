import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Product, Variant } from "../types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatCurrency(
  price: number | string = 0,
  currency: string = "INR"
) {
  return Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    Number(price)
  );
}

export function checkInStock(
  product: Product,
  selectedOptions: Record<string, string>
) {
  const variant = findVariant(product, selectedOptions);
  return variant ? variant.stock?.inStock : product.stock?.inStock;
}

export function findVariant(
  product: Product,
  selectedOptions: Record<string, string>
): Variant | null {
  if (!product.variants || product.variants.length === 0) return null;

  const choiceKeys = Object.keys(selectedOptions);

  return (
    product.variants.find((v) => {
      const variantChoices = v.choices || {};
      const variantKeys = Object.keys(variantChoices);
      // Strict match: must have same number of options and identical values
      return (
        variantKeys.length === choiceKeys.length &&
        choiceKeys.every((key) => variantChoices[key] === selectedOptions[key])
      );
    }) ?? null
  );
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function generateOrderId(): string {
  const timePart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `ORD-${timePart}${randomPart}`;
}

export function generateTransactionId(): string {
  const timePart = Date.now();
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `TXN-${timePart}${randomPart}`;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
