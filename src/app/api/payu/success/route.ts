/* eslint-disable no-console */
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

import { db } from "@/db";
import {
  media,
  order,
  orderItem,
  orderShippingAddress,
  payment,
  paymentAttempt,
  product,
  productVariant,
  shipment,
} from "@/db/schema";
import { delhiveryService } from "@/services/delhivery.service";
import { mailService } from "@/services/mail.service";
import { payuService } from "@/services/payu.service";
import type { PayuCallback } from "@/types/payu";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as PayuCallback;
    const salt = process.env.PAYU_MERCHANT_SALT!;

    const isValidHash = payuService.verifyResponseHash(data, salt);

    if (!isValidHash) {
      const invalidUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?payment=invalid`;
      return new NextResponse(
        `<html>
          <head><meta http-equiv="refresh" content="0;url=${invalidUrl}"></head>
          <body>
            <script>window.location.href="${invalidUrl}"</script>
          </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    //  Find Payment Attempt & Order
    const attempt = await db.query.paymentAttempt.findFirst({
      where: eq(paymentAttempt.txnId, data.txnid),
    });

    if (!attempt) {
      const notFoundUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?payment=notfound`;
      return new NextResponse(
        `<html>
          <head><meta http-equiv="refresh" content="0;url=${notFoundUrl}"></head>
          <body>
            <script>window.location.href="${notFoundUrl}"</script>
          </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    const orderRow = await db.query.order.findFirst({
      where: eq(order.id, attempt.orderId),
    });

    if (!orderRow) {
      const notFoundUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?payment=notfound`;
      return new NextResponse(
        `<html>
          <head><meta http-equiv="refresh" content="0;url=${notFoundUrl}"></head>
          <body>
            <script>window.location.href="${notFoundUrl}"</script>
          </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Process Payment Status
    if (data.status === "success") {
      try {
        await db.transaction(async (tx) => {
          // Update payment attempt
          await tx
            .update(paymentAttempt)
            .set({
              status: data.status,
              gatewayTxnId: data.mihpayid ?? null,
              mode: data.mode ?? null,
              metaData: data,
              updatedAt: new Date(),
            })
            .where(eq(paymentAttempt.id, attempt.id));

          // Update order status
          await tx
            .update(order)
            .set({
              paymentStatus: "paid",
              status: "processing",
            })
            .where(eq(order.id, attempt.orderId));

          // Create formal payment record
          await tx.insert(payment).values({
            id: uuidv7(),
            orderId: attempt.orderId,
            userId: orderRow.userId, // Using userId from orderRow
            gateway: "payu",
            gatewayTransactionId: data.mihpayid,
            amount: data.amount,
            status: "paid",
            paymentMethod: data.mode,
            metadata: data,
          });
        });
      } catch (dbError) {
        console.error("[PayU] Database transaction failed:", dbError);
        throw dbError;
      }
    } else {
      // Handle non-success payment statuses (fail, pending, bounced, etc.)
      console.warn("[PayU] Payment not successful. Status:", data.status);
      try {
        await db
          .update(paymentAttempt)
          .set({
            status: data.status,
            gatewayTxnId: data.mihpayid ?? null,
            mode: data.mode ?? null,
            metaData: data,
            updatedAt: new Date(),
          })
          .where(eq(paymentAttempt.id, attempt.id));
      } catch (err) {
        console.error(
          "[PayU] Failed to update attempt for non-success status:",
          err
        );
      }
    }

    // Send Order Confirmation Email & Create Shipment (only for successful payments)
    if (data.status === "success" && orderRow) {
      try {
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

        // Create shipment
        if (shippingAddr) {
          try {
            const { data: deliveryPackage, success } =
              await delhiveryService.createShipment({
                pickup_location: { name: process.env.DELHIVERY_WAREHOSE_NAME! },
                shipments: [
                  {
                    name: shippingAddr.fullName,
                    add: `${shippingAddr.addressLine1}${shippingAddr.addressLine2 ? `, ${shippingAddr.addressLine2}` : ""}`,
                    pin: shippingAddr.postalCode,
                    city: shippingAddr.city,
                    state: shippingAddr.state,
                    country: "India",
                    phone: shippingAddr.phone,
                    order: orderRow.orderNumber,
                    payment_mode: "Prepaid",
                    weight: "500",
                    shipping_mode: "Surface",
                    products_desc: items
                      .map((i) => i.productName)
                      .join(", ")
                      .substring(0, 100),
                    total_amount: orderRow.total,
                    cod_amount: "0",
                    quantity: items
                      .reduce((acc, i) => acc + i.quantity, 0)
                      .toString(),
                  },
                ],
              });
            if (success) {
              await db.insert(shipment).values({
                orderId: orderRow.id,
                addressId: shippingAddr.id,
                carrier: "Delhivery",
                trackingNumber: deliveryPackage.waybill,
                trackingUrl: `https://www.delhivery.com/track/package/${deliveryPackage.waybill}`,
                status: "ordered",
                shippedAt: new Date(),
                notes:
                  deliveryPackage.message +
                  `Upload WBN: ${deliveryPackage.upload_wbn}`,
                metadata: deliveryPackage,
              });
            } else {
              console.warn(
                `[PayU] Delhivery shipment creation failed for order ${orderRow.id}. Manual intervention needed.`
              );
              // TODO: Send admin email to create shipment manually
            }
          } catch (shipmentError) {
            console.error(
              `[PayU] Delhivery API error for order ${orderRow.id}:`,
              shipmentError
            );
            // Continue with email even if shipment fails
          }
        }

        // Send order receipt email
        try {
          await mailService.sendOrderReceipt(
            {
              ...orderRow,
              items: items.map((i) => ({
                id: i.id,
                name: i.productName || "Product",
                slug: i.productSlug,
                image: i.productImage,
                sku: i.variantSku,
                selectedOptions: i.variantOptions,
                quantity: i.quantity,
                price: i.price,
                shippingCost: orderRow.shippingCost ?? "0.00",
              })),
              shippingAddress: shippingAddr ?? null,
            },
            data.email
          );
        } catch (emailError) {
          console.error(
            `[PayU] Email sending failed for order ${orderRow.id}:`,
            emailError
          );
          // Continue—order is already processed
        }
      } catch (fulfillmentError) {
        console.error(
          `[PayU] Error during order fulfillment for order ${orderRow.id}:`,
          fulfillmentError
        );
        // Order is already marked as paid; this is a non-fatal error
      }
    }

    const finalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${attempt.orderId}`;

    const res = new NextResponse(
      `<html>
        <head><meta http-equiv="refresh" content="0;url=${finalUrl}"></head>
        <body>
          <script>window.location.href="${finalUrl}"</script>
        </body>
      </html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );

    if (orderRow.guestOrderToken) {
      res.cookies.set("diya-sessionId", orderRow.guestOrderToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return res;
  } catch (error) {
    console.error("[PayU] Unhandled error in PayU callback:", error);
    const errorUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?payment=error`;
    return new NextResponse(
      `<html>
        <head><meta http-equiv="refresh" content="0;url=${errorUrl}"></head>
        <body>
          <script>window.location.href="${errorUrl}"</script>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }
}
