import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ labourId: string }> }) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const { labourId } = await params;

  const labour = await prisma.labour.findUnique({ where: { id: labourId } });
  if (!labour) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (result.user.role === Role.SITE_MANAGER && labour.assignedSiteId !== result.user.siteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (result.user.role === Role.CONTRACTOR && labour.contractorId !== result.user.contractorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const history = await prisma.attendance.findMany({
    where: { labourId },
    orderBy: { date: "desc" }
  });

  return NextResponse.json(history);
}
