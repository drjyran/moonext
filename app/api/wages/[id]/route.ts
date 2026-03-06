import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

const schema = z.object({
  paidAmount: z.coerce.number().min(0)
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.wageRecord.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Wage record not found" }, { status: 404 });
  }

  if (auth.user.role === Role.SITE_MANAGER && auth.user.siteId !== existing.siteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const gross = Number(existing.grossAmount);
  const paid = Math.min(parsed.data.paidAmount, gross);
  const pending = Math.max(gross - paid, 0);

  const updated = await prisma.wageRecord.update({
    where: { id },
    data: {
      paidAmount: paid,
      pendingAmount: pending,
      paymentStatus: pending === 0 ? "PAID" : "PENDING"
    }
  });

  return NextResponse.json(updated);
}
