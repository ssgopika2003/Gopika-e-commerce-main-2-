import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { coupon } from "@/db/schema";
import { applyCouponSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = applyCouponSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid code format" },
        { status: 400 }
      );
    }
    const { code, subtotal } = validation.data;
    const now = new Date();
    const [existingCoupon] = await db
      .select()
      .from(coupon)
      .where(
        and(
          eq(coupon.code, code.toUpperCase()),
          eq(coupon.isActive, true),
          lte(coupon.startDate, now),
          gte(coupon.endDate, now)
        )
      )
      .limit(1);

    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon code" },
        { status: 400 }
      );
    }

    if (
      existingCoupon.usageLimit &&
      existingCoupon.usageCount &&
      existingCoupon.usageCount >= existingCoupon.usageLimit
    ) {
      return NextResponse.json(
        { success: false, message: "This coupon has reached its limit" },
        { status: 400 }
      );
    }

    if (subtotal < parseFloat(existingCoupon.minPurchaseAmount || "0")) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum purchase of ₹${existingCoupon.minPurchaseAmount} required`,
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-useless-assignment
    let discountAmount = 0;
    const value = parseFloat(existingCoupon.discountValue);

    if (existingCoupon.discountType === "percentage") {
      discountAmount = (subtotal * value) / 100;
      // cap discount
      if (existingCoupon.maxDiscountAmount) {
        discountAmount = Math.min(
          discountAmount,
          parseFloat(existingCoupon.maxDiscountAmount)
        );
      }
    } else {
      discountAmount = value;
    }

    return NextResponse.json({
      success: true,
      couponId: existingCoupon.id,
      code: existingCoupon.code,
      discountAmount: Number(discountAmount.toFixed(2)),
      discountType: existingCoupon.discountType,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
