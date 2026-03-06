import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(req: NextRequest) {
  const token = req.cookies.get("moonext_token")?.value;
  const path = req.nextUrl.pathname;

  if (
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path === "/login" ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    PUBLIC_FILE.test(path)
  ) {
    return NextResponse.next();
  }

  if (!token) {
    if (path.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
