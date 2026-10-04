import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawPath = url.pathname;
  const hasDocQuery =
    url.searchParams.has("documentNumber") ||
    url.searchParams.has("subscriptionNumber");

  const isTujarPath =
    rawPath === "/." ||
    rawPath.endsWith("/.") ||
    request.url.includes("/.") ||
    hasDocQuery;

  if (isTujarPath) {
    if (rawPath.startsWith("/document-verification")) {
      return NextResponse.next();
    }
    const dest = url.clone();
    dest.pathname = "/document-verification";
    return NextResponse.rewrite(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static assets with file extensions (e.g. .svg, .png, .jpg, .gif, .css, .js)
     * - admin, api, _next
     */
    "/((?!_next/static|_next/image|favicon\\.ico|assets|uploads|admin|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)",
    "/.",
  ],
};
