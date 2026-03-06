import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  return NextResponse.json({
    id: result.user.id,
    fullName: result.user.fullName,
    email: result.user.email,
    role: result.user.role,
    siteId: result.user.siteId,
    contractorId: result.user.contractorId
  });
}
