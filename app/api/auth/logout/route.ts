import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { sanitizeRedirectPath } from "@/lib/utils";

export async function POST(request: Request) {
  await clearAuthCookie();

  const requestUrl = new URL(request.url);
  const redirectTo = sanitizeRedirectPath(requestUrl.searchParams.get("redirectTo"), "/login");

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}
