import { and, eq, or } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  media,
  order,
  orderItem,
  orderShippingAddress,
  product,
  productVariant,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("diya-sessionId")?.value;

    const orderRow = await db.query.order.findFirst({
      where: and(
        eq(order.id, orderId),
        or(
          userId ? eq(order.userId, userId) : undefined,
          sessionId ? eq(order.guestOrderToken, sessionId) : undefined
        )
      ),
    });

    if (!orderRow) {
      return NextResponse.json(
        { message: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    const items = await db
      .select({
        id: orderItem.id,
        quantity: orderItem.quantity,
        price: orderItem.price,
        productId: orderItem.productId,
        variantId: orderItem.variantId,
        productName: product.name,
        productSlug: product.slug,
        productImage: media.url,
        variantSku: productVariant.sku,
        variantOptions: productVariant.optionValues,
      })
      .from(orderItem)
      .leftJoin(product, eq(orderItem.productId, product.id))
      .leftJoin(productVariant, eq(orderItem.variantId, productVariant.id))
      .leftJoin(
        media,
        and(
          eq(product.id, media.refId),
          eq(media.refType, "product"),
          eq(media.position, 0)
        )
      )
      .where(eq(orderItem.orderId, orderRow.id));

    const shippingAddr = await db.query.orderShippingAddress.findFirst({
      where: eq(orderShippingAddress.orderId, orderRow.id),
    });

    return NextResponse.json({
      order: {
        id: orderRow.id,
        orderNumber: orderRow.orderNumber,
        status: orderRow.status,
        paymentStatus: orderRow.paymentStatus,
        fulfillmentStatus: orderRow.fulfillmentStatus,
        subtotal: orderRow.subtotal,
        shippingCost: orderRow.shippingCost,
        total: orderRow.total,
        discount: orderRow.discount,
        createdAt: orderRow.createdAt,
        items: items.map((i) => ({
          id: i.id,
          name: i.productName,
          slug: i.productSlug,
          image: i.productImage,
          sku: i.variantSku,
          selectedOptions: i.variantOptions,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: shippingAddr ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
