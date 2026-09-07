import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ratelimit } from "@/lib/ratelimit";

export async function proxy(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api/payu")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    const identifier =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";

    try {
      const { success } = await ratelimit.limit(identifier);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            message: "Too many requests",
          },
          {
            status: 429,
          }
        );
      }
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
