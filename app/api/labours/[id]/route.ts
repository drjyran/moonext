import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  aadhaarNumber: z.string().length(12).optional(),
  skillType: z.string().min(2).optional(),
  dailyWage: z.coerce.number().positive().optional(),
  contractorId: z.string().optional(),
  assignedSiteId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  aadhaarDocUrl: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const existing = await prisma.labour.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (auth.user.role === Role.SITE_MANAGER && existing.assignedSiteId !== auth.user.siteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const labour = await prisma.labour.update({ where: { id }, data: parsed.data });
  return NextResponse.json(labour);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await prisma.labour.delete({ where: { id } });
  return NextResponse.json({ message: "Labour deleted" });
}
