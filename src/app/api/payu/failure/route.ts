import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { paymentAttempt } from "@/db/schema";
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

    // Verify Hash
    const isValidHash = payuService.verifyResponseHash(data, salt);

    if (!isValidHash) {
      const invalidUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?payment=invalid`;
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

    // Find and Update Payment Attempt
    const attempt = await db.query.paymentAttempt.findFirst({
      where: eq(paymentAttempt.txnId, data.txnid),
    });

    if (attempt) {
      await db
        .update(paymentAttempt)
        .set({
          status: data.status,
          gatewayTxnId: data.mihpayid ?? null,
          mode: data.mode ?? null,
          error: data.error_Message || data.error || "Payment failed",
          metaData: data,
          updatedAt: new Date(),
        })
        .where(eq(paymentAttempt.id, attempt.id));
    }

    const finalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failed?txnId=${data.txnid}&orderId=${attempt?.orderId || ""}`;

    return new NextResponse(
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
  } catch {
    const errorUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?payment=error`;
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
