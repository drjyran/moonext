import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-100 via-white to-orange-50 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:p-12">
        <div className="max-w-2xl space-y-4">
          <p className="inline-flex rounded-full bg-moonext-navy px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Moonext Constructions Pvt Ltd
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Labour Management System
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            Centralized management for labour attendance, site allocation, contractor tracking, and wage insights across all construction sites.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login" className="rounded-lg bg-moonext-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Login
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
              Open Dashboard
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl bg-moonext-navy p-5 text-white">
          <h2 className="text-lg font-semibold">Core Modules</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            <li>Labour & Contractor Management</li>
            <li>Daily Attendance + Work Descriptions</li>
            <li>Full Time / Half Time / Overtime Tracking</li>
            <li>Wage Calculation & Payment Breakdown</li>
            <li>Site-wise Analytics & Reports</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
