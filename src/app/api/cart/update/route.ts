import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cart, cartItem } from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateCartItemSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = updateCartItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { itemId, newQuantity } = result.data;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("diya-sessionId")?.value;

    const item = await db.query.cartItem.findFirst({
      where: eq(cartItem.id, itemId),
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const ownerCart = await db.query.cart.findFirst({
      where: eq(cart.id, item.cartId),
    });

    if (!ownerCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const isOwner = userId
      ? ownerCart.userId === userId
      : sessionId && ownerCart.sessionId === sessionId;

    if (!isOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await db
      .update(cartItem)
      .set({ quantity: newQuantity })
      .where(eq(cartItem.id, itemId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to update item" },
      { status: 500 }
    );
  }
}
