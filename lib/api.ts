import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCurrentUserFromRequest, hasRole } from "@/lib/auth";

export async function requireUser(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user };
}

export async function requireRole(request: NextRequest, roles: Role[]) {
  const result = await requireUser(request);
  if ("error" in result) return result;
  if (!hasRole(result.user.role, roles)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
