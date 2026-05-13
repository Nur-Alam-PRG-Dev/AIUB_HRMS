import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];
const ADMIN_ROUTES = ["/admin"];

export function middleware(request) {
  const token = request.cookies.get("hrms_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isApi = pathname.startsWith("/api/auth");

  // Allow Next.js API auth routes
  if (isApi) return NextResponse.next();

  // Redirect to login if no token and not on a public route
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect away from auth pages if already logged in
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin routes: check role cookie
  if (token && isAdmin) {
    const role = request.cookies.get("hrms_role")?.value;
    if (!["super_admin", "hr_admin"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
