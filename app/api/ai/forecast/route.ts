import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const sites = await prisma.site.findMany({
    where: {
      ...(isSiteScopedRole(user.role) ? { id: user.siteId ?? "" } : {})
    },
    select: { id: true, name: true }
  });

  const insights = await Promise.all(
    sites.map(async (site) => {
      const last7 = await prisma.attendance.count({
        where: {
          siteId: site.id,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: { in: ["PRESENT", "HALF_DAY", "OVERTIME"] }
        }
      });
      const workers = await prisma.labour.count({ where: { assignedSiteId: site.id, status: "ACTIVE" } });
      const avgDailyPresence = workers > 0 ? last7 / 7 : 0;
      const projectedNeed = Math.max(0, Math.ceil(workers * 1.2 - avgDailyPresence));
      const shortageRisk = projectedNeed > 0 ? "HIGH" : workers < 5 ? "MEDIUM" : "LOW";

      return {
        siteId: site.id,
        siteName: site.name,
        projectedAdditionalWorkersNextWeek: projectedNeed,
        shortageRisk,
        insight: projectedNeed > 0
          ? `${site.name} may require ${projectedNeed} more workers next week.`
          : `${site.name} has adequate staffing based on the last 7 days.`
      };
    })
  );

  const month = new Date();
  const wages = await prisma.wageRecord.aggregate({
    where: {
      month: month.getMonth() + 1,
      year: month.getFullYear(),
      ...(isSiteScopedRole(user.role) ? { siteId: user.siteId ?? "" } : {})
    },
    _sum: { grossAmount: true, pendingAmount: true }
  });

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    insights,
    costAnalysis: {
      grossPayroll: Number(wages._sum.grossAmount || 0),
      pendingPayroll: Number(wages._sum.pendingAmount || 0)
    }
  });
}
