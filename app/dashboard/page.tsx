import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUserFromCookie();
  if (!user) redirect("/login");

  const labourWhere =
    user.role === Role.ADMIN
      ? {}
      : user.role === Role.SITE_MANAGER
        ? { assignedSiteId: user.siteId ?? "" }
        : { contractorId: user.contractorId ?? "" };

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const [totalWorkers, totalSites, attendanceToday, wageSummary] = await Promise.all([
    prisma.labour.count({ where: labourWhere }),
    prisma.site.count({ where: user.role === Role.SITE_MANAGER ? { id: user.siteId ?? "" } : {} }),
    prisma.attendance.count({
      where: {
        date: { gte: start, lt: end },
        ...(user.role === Role.SITE_MANAGER ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { labour: { contractorId: user.contractorId ?? "" } } : {})
      }
    }),
    prisma.wageRecord.aggregate({
      where: {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        ...(user.role === Role.SITE_MANAGER ? { siteId: user.siteId ?? "" } : {}),
        ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {})
      },
      _sum: { grossAmount: true }
    })
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Workers" value={String(totalWorkers)} tone="blue" />
        <StatCard title="Total Sites" value={String(totalSites)} tone="orange" />
        <StatCard title="Attendance Today" value={String(attendanceToday)} tone="green" />
        <StatCard title="Wage Summary (Month)" value={formatCurrency(Number(wageSummary._sum.grossAmount || 0))} tone="slate" />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone
}: {
  title: string;
  value: string;
  tone: "blue" | "orange" | "green" | "slate";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50"
      : tone === "orange"
        ? "border-orange-200 bg-orange-50"
        : tone === "green"
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}
