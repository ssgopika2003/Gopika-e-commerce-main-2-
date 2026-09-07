import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cart, cartItem, product, productVariant } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST() {
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
      return NextResponse.json({ valid: true });
    }

    const items = await db
      .select({
        cartItemId: cartItem.id,
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        productName: product.name,
        stockQuantity: productVariant.stockQuantity,
        trackInventory: productVariant.trackInventory,
      })
      .from(cartItem)
      .innerJoin(product, eq(cartItem.productId, product.id))
      .innerJoin(productVariant, eq(cartItem.variantId, productVariant.id))
      .where(eq(cartItem.cartId, existingCart.id));

    const outOfStockItems = items.filter((item) => {
      if (!item.trackInventory) return false;
      return (item.stockQuantity ?? 0) < item.quantity;
    });

    if (outOfStockItems.length > 0) {
      const errorMessages = outOfStockItems.map(
        (item) =>
          `${item.productName} is out of stock (Requested: ${item.quantity}, Available: ${item.stockQuantity ?? 0})`
      );

      return NextResponse.json(
        {
          valid: false,
          message: errorMessages.join(". "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to validate cart consistency" },
      { status: 500 }
    );
  }
}
