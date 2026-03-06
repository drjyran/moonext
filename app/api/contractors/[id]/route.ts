import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const contractor = await prisma.contractor.update({ where: { id }, data: parsed.data });
  return NextResponse.json(contractor);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await prisma.contractor.delete({ where: { id } });
  return NextResponse.json({ message: "Contractor deleted" });
}
