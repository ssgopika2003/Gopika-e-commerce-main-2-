import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cart, cartItem } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("diya-sessionId")?.value;

    const item = await db.query.cartItem.findFirst({
      where: eq(cartItem.id, id),
    });

    if (!item) {
      return NextResponse.json({ success: true });
    }

    const ownerCart = await db.query.cart.findFirst({
      where: eq(cart.id, item.cartId),
    });

    const isOwner = userId
      ? ownerCart?.userId === userId
      : sessionId && ownerCart?.sessionId === sessionId;

    if (!isOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await db.delete(cartItem).where(eq(cartItem.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 500 }
    );
  }
}
