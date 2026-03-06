import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const labourWhere =
    user.role === Role.ADMIN
      ? {}
      : user.role === Role.SITE_MANAGER
        ? { assignedSiteId: user.siteId ?? "" }
        : { contractorId: user.contractorId ?? "" };

  const [totalWorkers, activeWorkers, totalSites, monthlyExpense] = await Promise.all([
    prisma.labour.count({ where: labourWhere }),
    prisma.labour.count({ where: { ...labourWhere, status: "ACTIVE" } }),
    prisma.site.count({ where: user.role === Role.SITE_MANAGER ? { id: user.siteId ?? "" } : {} }),
    prisma.wageRecord.aggregate({
      where: {
        ...(user.role === Role.SITE_MANAGER ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {}),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      _sum: { grossAmount: true }
    })
  ]);

  const attendance = await prisma.attendance.findMany({
    where: {
      ...(user.role === Role.SITE_MANAGER ? { siteId: user.siteId ?? "" } : {}),
      ...(user.role === Role.CONTRACTOR ? { labour: { contractorId: user.contractorId ?? "" } } : {})
    },
    take: 200
  });

  const presentWeight = attendance.reduce((sum, record) => {
    if (record.status === "PRESENT") return sum + 1;
    if (record.status === "HALF_DAY") return sum + 0.5;
    if (record.status === "OVERTIME") return sum + 1;
    return sum;
  }, 0);
  const attendancePercent = attendance.length ? Number(((presentWeight / attendance.length) * 100).toFixed(2)) : 0;

  return NextResponse.json({
    totalWorkers,
    activeWorkers,
    inactiveWorkers: totalWorkers - activeWorkers,
    totalSites,
    monthlyWageExpense: Number(monthlyExpense._sum.grossAmount || 0),
    attendancePercent
  });
}
