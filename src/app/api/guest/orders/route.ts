import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  order,
  orderItem,
  orderShippingAddress,
  product,
  productVariant,
} from "@/db/schema";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const guestToken = cookieStore.get("guestOrderToken")?.value;

    if (!guestToken) {
      return NextResponse.json(
        {
          message:
            "No guest order token found. Please complete a guest checkout first.",
        },
        { status: 401 }
      );
    }

    const guestOrder = await db.query.order.findFirst({
      where: eq(order.guestOrderToken, guestToken),
    });

    if (!guestOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
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
        variantSku: productVariant.sku,
        variantOptions: productVariant.optionValues,
      })
      .from(orderItem)
      .leftJoin(product, eq(orderItem.productId, product.id))
      .leftJoin(productVariant, eq(orderItem.variantId, productVariant.id))
      .where(eq(orderItem.orderId, guestOrder.id));

    const shippingAddr = await db.query.orderShippingAddress.findFirst({
      where: eq(orderShippingAddress.orderId, guestOrder.id),
    });

    return NextResponse.json({
      order: {
        id: guestOrder.id,
        orderNumber: guestOrder.orderNumber,
        status: guestOrder.status,
        paymentStatus: guestOrder.paymentStatus,
        subtotal: guestOrder.subtotal,
        total: guestOrder.total,
        createdAt: guestOrder.createdAt,
        items: items.map((i) => ({
          id: i.id,
          productId: i.productId,
          variantId: i.variantId,
          name: i.productName,
          slug: i.productSlug,
          sku: i.variantSku,
          selectedOptions: i.variantOptions,
          quantity: i.quantity,
          price: i.price,
          subtotal: (Number(i.price) * i.quantity).toFixed(2),
        })),
        shippingAddress: shippingAddr ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch guest order" },
      { status: 500 }
    );
  }
}
