import { and, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { media, product, productVariant } from "@/db/schema";
import type { Product, ProductOption } from "@/types/product";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // Search for products by name or description
    const results = await db
      .select()
      .from(product)
      .where(
        and(
          eq(product.isActive, true),
          or(
            ilike(product.name, `%${query}%`),
            ilike(product.description, `%${query}%`)
          )
        )
      )
      .limit(10);

    if (results.length === 0) {
      return NextResponse.json([]);
    }

    // For each product, fetch its media and variants to build the full Product object
    const products: Product[] = await Promise.all(
      results.map(async (p) => {
        // Fetch media
        const productMedia = await db
          .select()
          .from(media)
          .where(and(eq(media.refId, p.id), eq(media.refType, "product")))
          .orderBy(media.position);

        // Fetch variants
        const variants = await db
          .select()
          .from(productVariant)
          .where(eq(productVariant.productId, p.id));

        // Calculate total stock
        const totalStock = variants.reduce(
          (acc, v) => acc + (v.stockQuantity || 0),
          0
        );
        const hasInventoryTracking = variants.some((v) => v.trackInventory);

        // Map base price and sale price
        const price = Number(p.basePrice);
        const discountedPrice = p.salePrice ? Number(p.salePrice) : price;

        return {
          _id: p.id,
          name: p.name,
          slug: p.slug,
          visible: p.isActive ?? true,
          description: p.description ?? "",
          ribbon: p.ribbon ?? undefined,
          brand: p.brand ?? undefined,
          priceData: {
            price,
            discountedPrice,
            currency: p.currency || "INR",
          },
          media: {
            items: productMedia.map((m) => ({
              _id: m.id,
              mediaType: "image",
              image: {
                url: m.url,
                altText: m.altText || p.name,
              },
            })),
            mainMedia: productMedia[0]
              ? {
                  _id: productMedia[0].id,
                  image: {
                    url: productMedia[0].url,
                    altText: productMedia[0].altText || p.name,
                  },
                }
              : undefined,
          },
          stock: {
            trackInventory: hasInventoryTracking,
            inStock: totalStock > 0 || !hasInventoryTracking,
            quantity: totalStock,
          },
          productOptions: (p.productOptions as ProductOption[]) || [],
          variants: variants.map((v) => ({
            _id: v.id,
            choices: (v.optionValues as Record<string, string>) || {},
            stock: {
              trackQuantity: v.trackInventory,
              quantity: v.stockQuantity,
              inStock: v.stockQuantity > 0,
            },
            variant: {
              priceData: {
                price: Number(v.price || p.basePrice),
                discountedPrice: Number(v.price || p.salePrice || p.basePrice),
                currency: p.currency || "INR",
              },
              visible: true,
              convertedPriceData: {
                price: Number(v.price || p.basePrice),
                discountedPrice: Number(v.price || p.salePrice || p.basePrice),
                currency: p.currency || "INR",
              },
            },
          })),
        } as Product;
      })
    );

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
