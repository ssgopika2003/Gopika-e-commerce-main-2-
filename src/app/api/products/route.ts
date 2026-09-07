import { and, eq } from "drizzle-orm";

import db from "@/db";
import { media, product } from "@/db/schema";

export async function GET() {
  try {
    const products = await db
      .select({
        name: product.name,
        slug: product.slug,
        imageUrl: media.url,
      })
      .from(product)
      .leftJoin(
        media,
        and(
          eq(product.id, media.refId),
          eq(media.refType, "product"),
          eq(media.position, 0)
        )
      )
      .where(eq(product.isActive, true));
    if (!products || products.length === 0) {
      return Response.json({ message: "No products found" }, { status: 404 });
    }
    return Response.json(products);
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
