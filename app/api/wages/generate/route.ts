import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const schema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2100),
  siteId: z.string().optional(),
  contractorId: z.string().optional()
});
function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const month = Number(request.nextUrl.searchParams.get("month") || new Date().getMonth() + 1);
  const year = Number(request.nextUrl.searchParams.get("year") || new Date().getFullYear());

  const wages = await prisma.wageRecord.findMany({
    where: {
      month,
      year,
      ...(isSiteScopedRole(result.user.role) ? { siteId: result.user.siteId ?? "" } : {}),
      ...(result.user.role === Role.CONTRACTOR ? { contractorId: result.user.contractorId ?? "" } : {})
    },
    include: {
      labour: { select: { fullName: true, phone: true } },
      contractor: { select: { name: true } },
      site: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(wages);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER, Role.PROJECT_MANAGER, Role.SITE_SUPERVISOR, Role.ACCOUNTANT]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { month, year } = parsed.data;

  const labourWhere = {
    ...(parsed.data.siteId ? { assignedSiteId: parsed.data.siteId } : {}),
    ...(parsed.data.contractorId ? { contractorId: parsed.data.contractorId } : {}),
    ...(isSiteScopedRole(auth.user.role) ? { assignedSiteId: auth.user.siteId ?? "" } : {})
  };

  const labours = await prisma.labour.findMany({ where: labourWhere });

  for (const labour of labours) {
    const attendance = await prisma.attendance.findMany({
      where: {
        labourId: labour.id,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1)
        }
      }
    });

    const fullTimeDays = attendance.filter((record) => record.shiftType === "FULL_TIME").length;
    const halfTimeDays = attendance.filter((record) => record.shiftType === "HALF_TIME").length;
    const overtimeHours = attendance.reduce(
      (sum, record) => sum + (record.shiftType === "OVER_TIME" ? Number(record.overtimeHours) : 0),
      0
    );
    const presentDays = fullTimeDays + halfTimeDays * 0.5;

    const dailyWage = Number(labour.dailyWage);
    const halfDayWage = labour.halfDayWage ? Number(labour.halfDayWage) : dailyWage / 2;
    const overtimeHourly = labour.overtimeWage ? Number(labour.overtimeWage) : (dailyWage / 8) * 1.5;

    const fullTimePay = fullTimeDays * dailyWage;
    const halfTimePay = halfTimeDays * halfDayWage;
    const overtimePay = overtimeHours * overtimeHourly;
    const grossAmount = fullTimePay + halfTimePay + overtimePay;

    await prisma.wageRecord.upsert({
      where: {
        labourId_month_year: {
          labourId: labour.id,
          month,
          year
        }
      },
      create: {
        labourId: labour.id,
        siteId: labour.assignedSiteId,
        contractorId: labour.contractorId,
        month,
        year,
        presentDays,
        fullTimeDays,
        halfTimeDays,
        overtimeHours,
        fullTimePay,
        halfTimePay,
        overtimePay,
        grossAmount,
        pendingAmount: grossAmount
      },
      update: {
        presentDays,
        fullTimeDays,
        halfTimeDays,
        overtimeHours,
        fullTimePay,
        halfTimePay,
        overtimePay,
        grossAmount,
        pendingAmount: grossAmount
      }
    });
  }

  return NextResponse.json({ message: "Wages generated", workersProcessed: labours.length });
}
