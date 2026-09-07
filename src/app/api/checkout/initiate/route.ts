import { and, eq, gte, lte, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

import { db } from "@/db";
import {
  cart,
  cartItem,
  coupon,
  couponUsage,
  order,
  orderItem,
  orderShippingAddress,
  paymentAttempt,
  productVariant,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { FREE_SHIPPING_THRESHOLD_ITEMS, SHIPPING_COST } from "@/lib/constants";
import { generateOrderId, generateTransactionId } from "@/lib/utils";
import { checkoutInitiateSchema } from "@/lib/validations";
import { payuService } from "@/services/payu.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = checkoutInitiateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      shippingDetails,
      isDirect,
      variantId,
      quantity,
      totalAmount,
      couponCode,
    } = validation.data;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;

    let lineItems: {
      productId: string;
      variantId: string;
      price: number;
      quantity: number;
    }[] = [];

    let existingCartId: string | null = null;

    if (isDirect && variantId) {
      const [row] = await db
        .select({
          price: productVariant.price,
          productId: productVariant.productId,
        })
        .from(productVariant)
        .where(eq(productVariant.id, variantId))
        .limit(1);

      if (!row) {
        return NextResponse.json(
          { message: "Variant not found" },
          { status: 404 }
        );
      }

      lineItems = [
        {
          productId: row.productId,
          variantId,
          price: Number(row.price ?? 0),
          quantity: quantity ?? 1,
        },
      ];
    } else {
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
        return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      existingCartId = existingCart.id;

      const items = await db
        .select({
          productId: cartItem.productId,
          variantId: cartItem.variantId,
          quantity: cartItem.quantity,
          price: cartItem.price,
        })
        .from(cartItem)
        .where(eq(cartItem.cartId, existingCart.id));

      if (!items.length) {
        return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
      }

      lineItems = items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId ?? "",
        price: Number(i.price),
        quantity: i.quantity,
      }));
    }

    const subtotalAmount = lineItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const totalQuantity = lineItems.reduce((sum, i) => sum + i.quantity, 0);
    const shippingCost =
      totalQuantity >= FREE_SHIPPING_THRESHOLD_ITEMS ? 0 : SHIPPING_COST;

    let discountAmount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const now = new Date();
      const existingCoupon = await db.query.coupon.findFirst({
        where: and(
          eq(coupon.code, couponCode.toUpperCase()),
          eq(coupon.isActive, true),
          gte(coupon.endDate, now),
          lte(coupon.startDate, now)
        ),
      });

      if (!existingCoupon) {
        return NextResponse.json(
          { message: "Invalid or expired coupon code" },
          { status: 400 }
        );
      }

      if (subtotalAmount < Number(existingCoupon.minPurchaseAmount)) {
        return NextResponse.json(
          {
            message: `Minimum purchase of ${existingCoupon.minPurchaseAmount} required for this coupon`,
          },
          { status: 400 }
        );
      }

      if (
        existingCoupon.usageLimit &&
        (existingCoupon.usageCount ?? 0) >= existingCoupon.usageLimit
      ) {
        return NextResponse.json(
          { message: "Coupon usage limit reached" },
          { status: 400 }
        );
      }

      if (existingCoupon.discountType === "percentage") {
        discountAmount =
          (subtotalAmount * Number(existingCoupon.discountValue)) / 100;
        if (
          existingCoupon.maxDiscountAmount &&
          discountAmount > Number(existingCoupon.maxDiscountAmount)
        ) {
          discountAmount = Number(existingCoupon.maxDiscountAmount);
        }
      } else {
        discountAmount = Number(existingCoupon.discountValue);
      }
      appliedCouponId = existingCoupon.id;
    }

    const calculatedTotal = Math.max(
      0,
      subtotalAmount - discountAmount + shippingCost
    );

    // Price validation from frontend
    if (totalAmount !== undefined) {
      const diff = Math.abs(calculatedTotal - totalAmount);
      if (diff > 0.01) {
        return NextResponse.json(
          {
            message: "Price mismatch. Please refresh your cart and try again.",
            serverTotal: calculatedTotal.toFixed(2),
            frontendTotal: totalAmount.toFixed(2),
          },
          { status: 400 }
        );
      }
    }

    const txnId = generateTransactionId();

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("diya-sessionId")?.value;

    if (!userId && !sessionId) {
      sessionId = uuidv7();
    }

    const guestOrderToken = userId ? null : sessionId;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderRow, attemptRow } = await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(order)
        .values({
          id: uuidv7(),
          orderNumber: generateOrderId(),
          userId,
          guestOrderToken,
          status: "pending",
          paymentStatus: "pending",
          subtotal: subtotalAmount.toFixed(2),
          discount: discountAmount.toFixed(2),
          shippingCost: shippingCost.toFixed(2),
          total: calculatedTotal.toFixed(2),
        })
        .returning();

      if (appliedCouponId) {
        await tx.insert(couponUsage).values({
          id: uuidv7(),
          couponId: appliedCouponId,
          userId: userId || null,
          orderId: newOrder.id,
          discountAmount: discountAmount.toFixed(2),
        });

        // Update usage count
        await tx
          .update(coupon)
          .set({
            usageCount: sql`${coupon.usageCount} + 1`,
          })
          .where(eq(coupon.id, appliedCouponId));
      }

      await tx.insert(orderItem).values(
        lineItems.map((item) => ({
          id: uuidv7(),
          orderId: newOrder.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          snapshot: { price: item.price, quantity: item.quantity },
        }))
      );

      await tx.insert(orderShippingAddress).values({
        id: uuidv7(),
        orderId: newOrder.id,
        fullName: shippingDetails.fullName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        addressLine1: shippingDetails.addressLine1,
        addressLine2: shippingDetails.addressLine2 || null,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country,
      });

      const [newAttempt] = await tx
        .insert(paymentAttempt)
        .values({
          id: uuidv7(),
          orderId: newOrder.id,
          txnId,
          gateway: "payU",
          amount: calculatedTotal.toFixed(2),
          status: "pending",
        })
        .returning();

      return { orderRow: newOrder, attemptRow: newAttempt };
    });

    const payuParams = {
      key: process.env.PAYU_MERCHANT_KEY!,
      txnid: txnId,
      amount: calculatedTotal.toFixed(2),
      productinfo: orderRow.orderNumber,
      firstname: shippingDetails.fullName.split(" ")[0] || "User",
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      udf1: orderRow.id,
      udf2: userId || "guest",
      udf3: appliedCouponId || "",
    };

    const salt = process.env.PAYU_MERCHANT_SALT!;
    const payload = payuService.buildPayload(payuParams, salt, {
      surl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payu/success`,
      furl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payu/failure`,
      payuUrl: process.env.NEXT_PUBLIC_PAYU_URL!,
    });

    const responsePayload = {
      ...payload,
      productInfo: payload.productinfo,
      firstName: payload.firstname,
      addressLine1: shippingDetails.addressLine1,
      addressLine2: shippingDetails.addressLine2,
      city: shippingDetails.city,
      state: shippingDetails.state,
      country: shippingDetails.country,
      zipcode: shippingDetails.postalCode,
    };

    const res = NextResponse.json(responsePayload);

    if (guestOrderToken) {
      res.cookies.set("diya-sessionId", guestOrderToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: "Failed to initiate checkout" },
      { status: 500 }
    );
  }
}
