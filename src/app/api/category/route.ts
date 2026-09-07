import db from "@/db";
import { category } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(category)
      .orderBy(category.position);
    if (!categories || categories.length === 0) {
      return Response.json({ message: "No categories found" }, { status: 404 });
    }
    return Response.json(categories);
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
