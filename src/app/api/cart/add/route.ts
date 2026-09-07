import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

import { db } from "@/db";
import { cart, cartItem, media, product, productVariant } from "@/db/schema";
import { auth } from "@/lib/auth";
import { addToCartSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = addToCartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = result.data;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;

    const cookieStore = cookies();
    let sessionId = (await cookieStore).get("diya-sessionId")?.value;

    if (!userId && !sessionId) {
      sessionId = uuidv7();
      (await cookieStore).set("diya-sessionId", sessionId, {
        httpOnly: true,
        path: "/",
      });
    }

    let existingCart;

    if (userId) {
      existingCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
      });
    } else {
      existingCart = await db.query.cart.findFirst({
        where: eq(cart.sessionId, sessionId!),
      });
    }

    if (!existingCart) {
      const newCart = await db
        .insert(cart)
        .values({
          userId: userId ?? null,
          sessionId: userId ? null : sessionId,
        })
        .returning();
      existingCart = newCart[0];
    }

    let variant;
    if (variantId) {
      variant = await db.query.productVariant.findFirst({
        where: eq(productVariant.id, variantId),
      });
    } else {
      variant = await db.query.productVariant.findFirst({
        where: eq(productVariant.productId, productId),
      });
    }

    if (!variant) {
      return NextResponse.json(
        { message: "Variant not found" },
        { status: 404 }
      );
    }

    // snapshot enrichment: avoids re-joining product/media in GET
    const [productRow] = await db
      .select({ name: product.name, slug: product.slug })
      .from(product)
      .where(eq(product.id, variant.productId))
      .limit(1);

    const [primaryMedia] = await db
      .select({ url: media.url })
      .from(media)
      .where(
        and(
          eq(media.refId, variant.productId),
          eq(media.refType, "product"),
          eq(media.position, 0)
        )
      )
      .limit(1);

    const enrichedSnapshot = {
      name: productRow?.name ?? "",
      slug: productRow?.slug ?? "",
      imageUrl: primaryMedia?.url ?? null,
      price: Number(variant.price ?? 0),
      sku: variant.sku,
      optionValues: variant.optionValues as Record<string, string>,
    };

    const existingItem = await db.query.cartItem.findFirst({
      where: and(
        eq(cartItem.cartId, existingCart.id),
        eq(cartItem.variantId, variant.id)
      ),
    });

    if (existingItem) {
      await db
        .update(cartItem)
        .set({
          quantity: existingItem.quantity + quantity,
          snapshot: enrichedSnapshot,
        })
        .where(eq(cartItem.id, existingItem.id));
    } else {
      await db.insert(cartItem).values({
        cartId: existingCart.id,
        productId: variant.productId,
        variantId: variant.id,
        quantity,
        price: variant.price!,
        snapshot: enrichedSnapshot,
      });
    }

    return NextResponse.json({ message: "Added to cart successfully" });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
