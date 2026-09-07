import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cart, cartItem } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function DELETE() {
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
      return NextResponse.json({ success: true });
    }

    await db.delete(cartItem).where(eq(cartItem.cartId, existingCart.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
