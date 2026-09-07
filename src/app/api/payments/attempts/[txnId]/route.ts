import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { paymentAttempt } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ txnId: string }> }
) {
  try {
    const { txnId } = await params;

    const attempt = await db.query.paymentAttempt.findFirst({
      where: eq(paymentAttempt.txnId, txnId),
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "Payment attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attempt);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch payment attempt" },
      { status: 500 }
    );
  }
}
