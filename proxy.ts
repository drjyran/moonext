import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;
const PUBLIC_ROUTES = new Set([
  "/",
  "/about",
  "/services",
  "/projects",
  "/contact",
  "/staff-access",
  "/login",
  "/careers",
  "/gallery",
  "/api/health",
  "/api/contact",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
]);

export function proxy(req: NextRequest) {
  const token = req.cookies.get("moonext_token")?.value;
  const path = req.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.has(path) || path.startsWith("/projects/");

  if (
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    isPublicRoute ||
    PUBLIC_FILE.test(path)
  ) {
    return NextResponse.next();
  }

  if (!token) {
    if (path.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", req.url);
    const nextPath = `${path}${req.nextUrl.search}`;
    loginUrl.searchParams.set("next", nextPath);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
