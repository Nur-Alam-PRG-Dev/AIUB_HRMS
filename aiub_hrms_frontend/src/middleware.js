import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals, static files, and BetterAuth API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("hrms_token")?.value;
  const role = request.cookies.get("hrms_role")?.value;

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAdminPath = pathname.startsWith("/admin");
  const isRootPath = pathname === "/";

  // Root redirect
  if (isRootPath) {
    return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", request.url));
  }

  // Not logged in → redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → don't allow public pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin section → check role
  if (token && isAdminPath) {
    if (!role || !["super_admin", "hr_admin"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
