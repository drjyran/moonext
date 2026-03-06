import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

function dayStart(input: Date) {
  return new Date(input.getFullYear(), input.getMonth(), input.getDate());
}

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();
  if (!user) redirect("/login");

  const isSiteScoped = isSiteScopedRole(user.role);

  const labourWhere =
    user.role === Role.ADMIN || user.role === Role.ACCOUNTANT
      ? {}
      : isSiteScoped
        ? { assignedSiteId: user.siteId ?? "" }
        : { contractorId: user.contractorId ?? "" };

  const siteWhere = isSiteScoped ? { id: user.siteId ?? "" } : {};

  const today = new Date();
  const start = dayStart(today);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalWorkers, totalSites, totalContractors, attendanceToday, wageSummary, attendanceTrend, siteUsage] = await Promise.all([
    prisma.labour.count({ where: labourWhere }),
    prisma.site.count({ where: siteWhere }),
    prisma.contractor.count(),
    prisma.attendance.count({
      where: {
        date: { gte: start, lt: end },
        ...(isSiteScoped ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { labour: { contractorId: user.contractorId ?? "" } } : {})
      }
    }),
    prisma.wageRecord.aggregate({
      where: {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        ...(isSiteScoped ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {})
      },
      _sum: { grossAmount: true }
    }),
    prisma.attendance.groupBy({
      by: ["date"],
      where: {
        date: { gte: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), lt: end },
        ...(isSiteScoped ? { siteId: user.siteId ?? "" } : {})
      },
      _count: { _all: true },
      orderBy: { date: "asc" }
    }),
    prisma.labour.groupBy({
      by: ["assignedSiteId"],
      where: labourWhere,
      _count: { _all: true }
    })
  ]);

  const sites = await prisma.site.findMany({
    where: { id: { in: siteUsage.map((row) => row.assignedSiteId) } },
    select: { id: true, name: true }
  });
  const siteNameMap = new Map(sites.map((site) => [site.id, site.name]));

  const labourCostSeries = await prisma.wageRecord.groupBy({
    by: ["month"],
    where: {
      year: today.getFullYear(),
      month: { gte: Math.max(1, today.getMonth() - 2), lte: today.getMonth() + 1 },
      ...(isSiteScoped ? { siteId: user.siteId ?? "" } : {}),
      ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {})
    },
    _sum: { grossAmount: true },
    orderBy: { month: "asc" }
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Moonext Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Workers" value={String(totalWorkers)} />
        <StatCard title="Active Sites" value={String(totalSites)} />
        <StatCard title="Present Today" value={String(attendanceToday)} />
        <StatCard title="Payroll This Month" value={formatCurrency(Number(wageSummary._sum.grossAmount || 0))} />
        <StatCard title="Total Contractors" value={String(totalContractors)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Daily Attendance (Last 7 days)">
          <BarRows
            rows={attendanceTrend.map((row) => ({
              label: new Date(row.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit" }),
              value: row._count._all
            }))}
          />
        </ChartCard>

        <ChartCard title="Monthly Labour Cost">
          <BarRows
            rows={labourCostSeries.map((row) => ({
              label: `M${row.month}`,
              value: Number(row._sum.grossAmount || 0)
            }))}
            currency
          />
        </ChartCard>

        <ChartCard title="Site-wise Labour Usage">
          <BarRows
            rows={siteUsage.map((row) => ({
              label: siteNameMap.get(row.assignedSiteId) || "Unknown Site",
              value: row._count._all
            }))}
          />
        </ChartCard>
      </div>

      <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">
        Month started on {monthStart.toLocaleDateString("en-IN")}. Role scope: <span className="font-semibold">{user.role}</span>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function BarRows({ rows, currency = false }: { rows: Array<{ label: string; value: number }>; currency?: boolean }) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="text-sm text-slate-500">No data</p> : null}
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">{row.label}</span>
            <span>{currency ? formatCurrency(row.value) : row.value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-moonext-orange" style={{ width: `${Math.max(5, (row.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
