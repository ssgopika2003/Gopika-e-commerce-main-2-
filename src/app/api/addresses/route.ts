import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

import { db } from "@/db";
import { address } from "@/db/schema";
import { auth } from "@/lib/auth";
import { addressSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = addressSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid address data provided.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in to add an address." },
        { status: 401 }
      );
    }

    const validatedData = validation.data;

    const result = await db.transaction(async (tx) => {
      if (validatedData.isDefault) {
        await tx
          .update(address)
          .set({ isDefault: false })
          .where(eq(address.userId, userId));
      }

      const [newAddress] = await tx
        .insert(address)
        .values({
          id: uuidv7(),
          userId,
          ...validatedData,
        })
        .returning();

      return newAddress;
    });

    return NextResponse.json(
      { message: "Address saved successfully", data: result },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "An unexpected error occurred while saving the address." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await db.query.address.findMany({
      where: eq(address.userId, userId),
      orderBy: (addresses, { desc }) => [desc(addresses.isDefault)],
    });

    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}
