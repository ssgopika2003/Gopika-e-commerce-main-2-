import { eq } from "drizzle-orm";

import { db } from "@/db";
import { media, product as dbProduct, productVariant } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { variantId, quantity } = await req.json();

    if (!variantId) {
      return Response.json({ error: "variantId is required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(productVariant)
      .innerJoin(dbProduct, eq(productVariant.productId, dbProduct.id))
      .where(eq(productVariant.id, variantId))
      .limit(1);

    if (!result.length) {
      return Response.json(
        { error: "Product or Variant not found" },
        { status: 404 }
      );
    }

    const { product, productVariant: variant } = result[0];

    if (
      variant.trackInventory &&
      typeof variant.stockQuantity === "number" &&
      variant.stockQuantity < quantity
    ) {
      return Response.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const productMedia = await db
      .select()
      .from(media)
      .where(eq(media.refId, product.id))
      .orderBy(media.position)
      .limit(1);

    const price = Number(variant.price ?? product.basePrice ?? 0);
    const checkoutSession = {
      isDirectBuy: true,
      items: [
        {
          itemId: variant.id,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          image: productMedia[0]?.url ?? null,
          price,
          quantity,
          selectedOptions:
            (variant.optionValues as Record<string, string>) ?? {},
        },
      ],
      subtotal: price * quantity,
    };

    return Response.json(checkoutSession);
  } catch {
    return Response.json(
      { error: "Checkout initiation failed" },
      { status: 500 }
    );
  }
}
