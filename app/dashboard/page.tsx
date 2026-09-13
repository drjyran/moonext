import Link from "next/link";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { ClipboardList, FileDown, Settings, Users2 } from "lucide-react";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

function dayStart(input: Date) {
  return new Date(input.getFullYear(), input.getMonth(), input.getDate());
}

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

function formatRole(role: Role) {
  return role.replaceAll("_", " ");
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

  const [
    totalWorkers,
    totalSites,
    totalContractors,
    attendanceToday,
    wageSummary,
    attendanceTrend,
    siteUsage,
    scopedSite,
    scopedContractor
  ] = await Promise.all([
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
    }),
    user.siteId ? prisma.site.findUnique({ where: { id: user.siteId }, select: { name: true } }) : Promise.resolve(null),
    user.contractorId ? prisma.contractor.findUnique({ where: { id: user.contractorId }, select: { name: true } }) : Promise.resolve(null)
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

  const roleLabel = formatRole(user.role);
  const scopeLabel =
    user.role === Role.ADMIN || user.role === Role.ACCOUNTANT
      ? "All sites and contractor data"
      : scopedSite?.name || scopedContractor?.name || "Restricted workspace";

  const quickLinks = [
    {
      href: "/dashboard/attendance",
      label: "Track Attendance",
      description: "Capture today’s worker presence and overtime.",
      icon: ClipboardList
    },
    {
      href: "/dashboard/reports",
      label: "Generate Reports",
      description: "Open payroll exports and letterhead reports.",
      icon: FileDown
    },
    {
      href: "/dashboard/users",
      label: "Manage Users",
      description: "Review roles and account access.",
      icon: Users2
    },
    {
      href: "/dashboard/settings",
      label: "Profile Settings",
      description: "Update your profile and password.",
      icon: Settings
    }
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-moonext-navy text-white shadow-xl">
        <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Dashboard Overview</p>
              <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user.fullName}</h1>
              <p className="max-w-2xl text-sm leading-6 text-blue-100/90">
                You are signed in as {roleLabel}. Use the quick actions below to manage workforce records,
                export payroll, and keep your profile updated.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/attendance"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-moonext-navy transition hover:bg-slate-100"
              >
                Open Attendance
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Account Settings
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <HeroDetail label="Role" value={roleLabel} />
            <HeroDetail label="Access Scope" value={scopeLabel} />
            <HeroDetail label="Month Started" value={monthStart.toLocaleDateString("en-IN")} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Workers" value={String(totalWorkers)} />
        <StatCard title="Active Sites" value={String(totalSites)} />
        <StatCard title="Present Today" value={String(attendanceToday)} />
        <StatCard title="Payroll This Month" value={formatCurrency(Number(wageSummary._sum.grossAmount || 0))} />
        <StatCard title="Total Contractors" value={String(totalContractors)} />
      </div>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="surface-card group flex min-h-[148px] flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-moonext-navy">
                <Icon size={20} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">{item.label}</h2>
                  <span className="text-sm font-medium text-slate-400 transition group-hover:text-moonext-orange">Open</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
        The dashboard is scoped to <span className="font-semibold text-slate-900">{scopeLabel}</span>. Use
        <Link href="/dashboard/settings" className="mx-1 font-semibold text-moonext-navy underline-offset-2 hover:underline">
          Settings
        </Link>
        to update your profile or change your password.
      </div>
    </div>
  );
}

function HeroDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="surface-card p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <h2 className="mt-3 break-words text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-4 sm:p-5">
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
            <span className="truncate pr-3">{row.label}</span>
            <span className="shrink-0">{currency ? formatCurrency(row.value) : row.value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-moonext-orange" style={{ width: `${Math.max(5, (row.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
