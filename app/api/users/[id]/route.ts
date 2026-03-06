import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "SITE_MANAGER", "CONTRACTOR"]).optional(),
  siteId: z.string().nullable().optional(),
  contractorId: z.string().nullable().optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data
  });

  return NextResponse.json({ id: updated.id, role: updated.role });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (id === auth.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "User deleted" });
}
