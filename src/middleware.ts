import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// @@@ https://nextjs.org/docs/messages/middleware-request-page

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  if (request.nextUrl.search.includes("username=")) {
    if (!request.nextUrl.search.includes("top=")) {
      return NextResponse.redirect(
        new URL(`${request.nextUrl.pathname}?top=24h`, request.url)
      );
    }
  }
}
