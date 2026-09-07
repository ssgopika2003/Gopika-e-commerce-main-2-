import { ALL_PRODUCTS } from "@/data/products";
import type { Product } from "@/types/product";

export function getProductBySlugMock(slug: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = ALL_PRODUCTS.find((p) => p.slug === slug);
      resolve(product || null);
    }, 500);
  });
}

export function getAllProductsMock(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ALL_PRODUCTS);
    }, 500);
  });
}
