import type { MetadataRoute } from "next";

import { siteUrl } from "@/config/site";
import { getAllProductsMock } from "@/lib/product-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductsMock();

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const routes = ["", "/about-us"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  return [...routes, ...productRoutes];
}
