import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cart, cartItem } from "@/db/schema";
import { auth } from "@/lib/auth";
import { productViewFromSnapshot } from "@/lib/mappers/product.mapper";
import type { Cart, CartItem as FrontendCartItem } from "@/types/cart";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("diya-sessionId")?.value;
    let existingCart;

    if (userId) {
      existingCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
      });
    } else if (sessionId) {
      existingCart = await db.query.cart.findFirst({
        where: eq(cart.sessionId, sessionId),
      });
    }

    if (!existingCart) {
      return NextResponse.json({ cart: null });
    }

    // snapshot avoids re-joining product/media in GET
    const items = await db
      .select({
        id: cartItem.id,
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        snapshot: cartItem.snapshot,
      })
      .from(cartItem)
      .where(eq(cartItem.cartId, existingCart.id));

    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    const frontendItems: FrontendCartItem[] = items.map((item) => {
      // snapshot: name, slug, imageUrl, price, sku, optionValues
      const snap = item.snapshot as {
        name?: string;
        slug?: string;
        imageUrl?: string | null;
        price?: number;
        sku?: string;
        optionValues?: Record<string, string>;
      };

      const productView = productViewFromSnapshot(
        item.productId,
        snap.slug ?? "",
        {
          name: snap.name ?? "",
          imageUrl: snap.imageUrl ?? null,
          price: snap.price ?? Number(item.price),
          sku: snap.sku ?? "",
          optionValues: snap.optionValues ?? {},
        }
      );

      return {
        cartItemId: item.id,
        product: productView,
        variantId: item.variantId ?? undefined,
        quantity: item.quantity,
        selectedOptions: snap.optionValues ?? {},
      };
    });

    const responseCart: Cart = {
      id: existingCart.id,
      userId: existingCart.userId,
      sessionId: existingCart.sessionId,
      items: frontendItems,
      subtotal,
      total: subtotal,
      createdAt: existingCart.createdAt.toISOString(),
      updatedAt: existingCart.updatedAt.toISOString(),
    };

    return NextResponse.json({ cart: responseCart });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
