import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";
import { labourPaymentCycles } from "@/lib/labour-finance";
import { labourBackupInclude, sendLabourBackupEmail } from "@/lib/labour-backup-email";

const schema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  aadhaarNumber: z.string().length(12).optional(),
  skillType: z.string().min(2).optional(),
  paymentCycle: z.enum(labourPaymentCycles).optional(),
  dailyWage: z.coerce.number().min(0).optional(),
  monthlyWage: z.coerce.number().min(0).nullable().optional(),
  contractorId: z.string().optional(),
  assignedSiteId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  aadhaarDocUrl: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER, Role.PROJECT_MANAGER, Role.SITE_SUPERVISOR]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const existing = await prisma.labour.findUnique({
    where: { id },
    include: labourBackupInclude
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    (auth.user.role === Role.SITE_MANAGER ||
      auth.user.role === Role.PROJECT_MANAGER ||
      auth.user.role === Role.SITE_SUPERVISOR) &&
    existing.assignedSiteId !== auth.user.siteId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const nextPaymentCycle = parsed.data.paymentCycle ?? existing.paymentCycle;
  const nextDailyWage =
    parsed.data.dailyWage !== undefined ? parsed.data.dailyWage : Number(existing.dailyWage);
  const nextMonthlyWage =
    parsed.data.monthlyWage !== undefined ? parsed.data.monthlyWage : existing.monthlyWage ? Number(existing.monthlyWage) : null;

  if (nextPaymentCycle === "DAILY" && nextDailyWage <= 0) {
    return NextResponse.json({ error: "Daily wage must be greater than 0" }, { status: 400 });
  }

  if (nextPaymentCycle === "MONTHLY" && (!nextMonthlyWage || nextMonthlyWage <= 0)) {
    return NextResponse.json({ error: "Monthly wage must be greater than 0" }, { status: 400 });
  }

  const labour = await prisma.labour.update({
    where: { id },
    data: {
      ...parsed.data,
      paymentCycle: nextPaymentCycle,
      dailyWage: nextPaymentCycle === "MONTHLY" ? 0 : nextDailyWage,
      monthlyWage: nextPaymentCycle === "MONTHLY" ? nextMonthlyWage : null
    },
    include: labourBackupInclude
  });

  await sendLabourBackupEmail({
    action: "updated",
    labour,
    previous: existing,
    actor: auth.user
  }).catch((error) => {
    console.error("Labour backup email failed after update:", error);
  });

  return NextResponse.json(labour);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const labour = await prisma.labour.delete({
    where: { id },
    include: labourBackupInclude
  });

  await sendLabourBackupEmail({
    action: "deleted",
    labour,
    actor: auth.user
  }).catch((error) => {
    console.error("Labour backup email failed after delete:", error);
  });

  return NextResponse.json({ message: "Labour deleted" });
}
