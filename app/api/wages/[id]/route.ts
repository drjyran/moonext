import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";
import { transactionPaymentModes } from "@/lib/labour-finance";
import { getPeriodTransactionMap, getWageSettlement, syncWagePaymentTransaction } from "@/lib/labour-settlement";

const schema = z.object({
  paidAmount: z.coerce.number().min(0),
  paymentMode: z.enum(transactionPaymentModes).optional(),
  remarks: z.string().max(500).optional(),
  transactionDate: z.string().optional()
});

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER, Role.PROJECT_MANAGER, Role.SITE_SUPERVISOR, Role.ACCOUNTANT]);
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

  if (isSiteScopedRole(auth.user.role) && auth.user.siteId !== existing.siteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const labour = await prisma.labour.findUnique({
    where: { id: existing.labourId },
    select: {
      paymentCycle: true
    }
  });

  if (!labour) {
    return NextResponse.json({ error: "Labour not found" }, { status: 404 });
  }

  const transactionMap = await getPeriodTransactionMap([existing.labourId], existing.month, existing.year);
  const settlement = getWageSettlement(
    Number(existing.grossAmount),
    Number(existing.paidAmount),
    transactionMap.get(existing.labourId) || []
  );
  const paid = Math.min(parsed.data.paidAmount, settlement.netPayable);
  const pending = Math.max(settlement.netPayable - paid, 0);
  const transactionDate = parsed.data.transactionDate ? new Date(parsed.data.transactionDate) : new Date();

  if (parsed.data.transactionDate && Number.isNaN(transactionDate.getTime())) {
    return NextResponse.json({ error: "Invalid payment date" }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const wage = await tx.wageRecord.update({
      where: { id },
      data: {
        paidAmount: paid,
        pendingAmount: pending,
        paymentStatus: pending === 0 ? "PAID" : "PENDING"
      }
    });

    await syncWagePaymentTransaction({
      db: tx,
      wageRecord: {
        id: wage.id,
        labourId: wage.labourId,
        siteId: wage.siteId,
        contractorId: wage.contractorId,
        month: wage.month,
        year: wage.year
      },
      paymentCycle: labour.paymentCycle,
      paidAmount: paid,
      paymentMode: parsed.data.paymentMode,
      remarks: parsed.data.remarks,
      transactionDate,
      createdById: auth.user.id
    });

    return wage;
  });

  return NextResponse.json(updated);
}
