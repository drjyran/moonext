import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  siteManagerId: z.string().nullable().optional(),
  projectStart: z.string().optional(),
  projectEnd: z.string().optional(),
  isActive: z.boolean().optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const site = await prisma.site.update({
    where: { id },
    data: {
      ...parsed.data,
      projectStart: parsed.data.projectStart ? new Date(parsed.data.projectStart) : undefined,
      projectEnd: parsed.data.projectEnd ? new Date(parsed.data.projectEnd) : undefined
    }
  });

  return NextResponse.json(site);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await prisma.site.delete({ where: { id } });
  return NextResponse.json({ message: "Site deleted" });
}
