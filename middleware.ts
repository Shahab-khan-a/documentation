import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawPath = url.pathname;
  const rawHref = request.url.toLowerCase();

  // 1. Direct Admin Panel Route - allow immediate access
  if (rawPath === "/admin" || rawPath.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // 2. Redirect to Admin Panel if /admin is typed in path, query string, or at the end of the URL
  const hasAdminQuery =
    url.searchParams.has("admin") ||
    url.searchParams.has("/admin") ||
    Array.from(url.searchParams.entries()).some(
      ([k, v]) =>
        k.toLowerCase().includes("admin") ||
        v.toLowerCase().endsWith("/admin") ||
        v.toLowerCase().endsWith("admin") ||
        v.toLowerCase().includes("/admin")
    );

  const isAdminRequested =
    rawPath.endsWith("/admin") ||
    rawPath.endsWith("/admin/") ||
    rawPath.includes("/admin/") ||
    rawPath.includes("/document-verification/admin") ||
    rawHref.endsWith("/admin") ||
    rawHref.endsWith("/admin/") ||
    rawHref.includes("/admin?") ||
    rawHref.includes("/admin#") ||
    rawHref.includes("=admin") ||
    hasAdminQuery;

  if (isAdminRequested) {
    const adminDest = url.clone();
    adminDest.pathname = "/admin";
    adminDest.search = "";
    return NextResponse.redirect(adminDest);
  }

  const hasDocQuery =
    url.searchParams.has("documentNumber") ||
    url.searchParams.has("subscriptionNumber");

  const isTujarPath =
    rawPath === "/." ||
    rawPath.endsWith("/.") ||
    request.url.includes("/.") ||
    hasDocQuery;

  if (rawPath === "/.") {
    const dest = url.clone();
    dest.pathname = "/document-verification";
    if (!hasDocQuery) {
      dest.searchParams.set("documentNumber", "205-178");
      dest.searchParams.set("subscriptionNumber", "205001150789");
    }
    return NextResponse.redirect(dest);
  }

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
