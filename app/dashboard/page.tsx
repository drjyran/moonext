import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();
  if (!user) return null;

  const labourWhere =
    user.role === Role.ADMIN
      ? {}
      : user.role === Role.SITE_MANAGER
        ? { assignedSiteId: user.siteId ?? "" }
        : { contractorId: user.contractorId ?? "" };

  const [totalWorkers, activeWorkers, totalSites, wageSum, siteWorkerBreakup] = await Promise.all([
    prisma.labour.count({ where: labourWhere }),
    prisma.labour.count({ where: { ...labourWhere, status: "ACTIVE" } }),
    prisma.site.count({ where: user.role === Role.SITE_MANAGER ? { id: user.siteId ?? "" } : {} }),
    prisma.wageRecord.aggregate({
      where: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        ...(user.role === Role.SITE_MANAGER ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {})
      },
      _sum: { grossAmount: true }
    }),
    prisma.labour.groupBy({
      by: ["assignedSiteId"],
      where: labourWhere,
      _count: { assignedSiteId: true }
    })
  ]);

  const sites = await prisma.site.findMany({
    where: { id: { in: siteWorkerBreakup.map((item) => item.assignedSiteId) } },
    select: { id: true, name: true }
  });

  const siteMap = new Map(sites.map((site) => [site.id, site.name]));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Workers" value={String(totalWorkers)} />
        <StatCard title="Active Workers" value={String(activeWorkers)} />
        <StatCard title="Total Active Sites" value={String(totalSites)} />
        <StatCard title="Monthly Wage Expense" value={formatCurrency(Number(wageSum._sum.grossAmount || 0))} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Workers Per Site</h2>
          <div className="space-y-2">
            {siteWorkerBreakup.map((item) => (
              <div key={item.assignedSiteId} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span>{siteMap.get(item.assignedSiteId) || "Unknown Site"}</span>
                <span className="font-semibold">{item._count.assignedSiteId}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Attendance Insights</h2>
          <SimpleProgress value={activeWorkers ? Number(((activeWorkers / Math.max(totalWorkers, 1)) * 100).toFixed(0)) : 0} />
          <p className="mt-2 text-xs text-slate-500">Active workforce percentage</p>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-moonext-slate">{value}</h3>
    </div>
  );
}

function SimpleProgress({ value }: { value: number }) {
  return (
    <div className="rounded-lg bg-slate-100 p-1">
      <div className="h-4 rounded-md bg-moonext-orange text-right text-[10px] leading-4 text-white" style={{ width: `${value}%` }}>
        {value}%
      </div>
    </div>
  );
}
