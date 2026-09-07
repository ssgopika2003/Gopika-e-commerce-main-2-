import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  order,
  orderItem,
  orderShippingAddress,
  product,
  productVariant,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.query.order.findMany({
      where: eq(order.userId, userId),
      orderBy: [desc(order.createdAt)],
    });

    const orderIds = orders.map((o) => o.id);

    if (!orderIds.length) {
      return NextResponse.json({ orders: [] });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (o) => {
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
          .where(eq(orderItem.orderId, o.id));

        const shippingAddr = await db.query.orderShippingAddress.findFirst({
          where: eq(orderShippingAddress.orderId, o.id),
        });

        return {
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          paymentStatus: o.paymentStatus,
          fulfillmentStatus: o.fulfillmentStatus,
          subtotal: o.subtotal,
          total: o.total,
          discount: o.discount,
          createdAt: o.createdAt,
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
        };
      })
    );

    return NextResponse.json({ orders: ordersWithDetails });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
