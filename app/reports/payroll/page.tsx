import { redirect } from "next/navigation";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { getPayrollReportRecords } from "@/lib/payroll-report";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PayrollPrintToolbar } from "@/components/reports/payroll-print-toolbar";

type SearchParamValue = string | string[] | undefined;

function readParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parseInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function formatMonthYear(month: number, year: number) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

export default async function PayrollLetterheadPage({
  searchParams
}: {
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const now = new Date();
  const month = parseInteger(readParam(params.month), now.getMonth() + 1, 1, 12);
  const year = parseInteger(readParam(params.year), now.getFullYear(), 2020, 2100);
  const siteId = readParam(params.siteId) || undefined;
  const contractorId = readParam(params.contractorId) || undefined;
  const autoPrint = readParam(params.print) === "1";

  const records = await getPayrollReportRecords({
    month,
    year,
    siteId,
    contractorId,
    role: user.role,
    userSiteId: user.siteId,
    userContractorId: user.contractorId
  });

  const totals = records.reduce(
    (acc, record) => {
      acc.gross += Number(record.grossAmount);
      acc.paid += Number(record.paidAmount);
      acc.pending += Number(record.pendingAmount);
      acc.overtimeHours += Number(record.overtimeHours);
      return acc;
    },
    { gross: 0, paid: 0, pending: 0, overtimeHours: 0 }
  );

  const csvParams = new URLSearchParams({
    month: String(month),
    year: String(year),
    ...(siteId ? { siteId } : {}),
    ...(contractorId ? { contractorId } : {})
  });

  return (
    <main className="print-page mx-auto w-full max-w-[1320px] px-4 py-6 md:px-6">
      <PayrollPrintToolbar autoPrint={autoPrint} csvUrl={`/api/reports/payroll.csv?${csvParams.toString()}`} />

      <section className="print-sheet relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="relative z-10 px-6 pb-40 pt-6 md:px-10 md:pb-44 md:pt-8">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#2f2d96,_#16155d)] text-3xl font-black tracking-[0.1em] text-white shadow-lg">
                M
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-moonext-orange">Payroll Report</p>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Moonext Constructions Pvt. Ltd.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  Detailed payroll statement prepared on official Moonext letterhead for labour payment, attendance,
                  and contractor reconciliation.
                </p>
              </div>
            </div>

            <div className="max-w-md space-y-1 text-left text-sm font-semibold leading-6 text-slate-700 md:text-right">
              <p className="text-base font-bold text-slate-950">CIN No.: U45209BR2020PTC046852</p>
              <p>Regd. Office: C/O-Asgari, Bhuneshwar Chowk</p>
              <p>RNG B. Complex, Ramnagar</p>
              <p>West Champaran, Bihar, India, 845106</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr,0.65fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Report Period</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{formatMonthYear(month, year)}</h2>
                </div>
                <div className="text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Generated:</span> {formatDate(now)}</p>
                  <p><span className="font-semibold text-slate-900">Prepared By:</span> {user.fullName}</p>
                  <p><span className="font-semibold text-slate-900">Role:</span> {user.role.replaceAll("_", " ")}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Site Filter</p>
                  <p className="mt-1 font-semibold text-slate-950">{siteId ? "Filtered site report" : "All sites"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contractor Filter</p>
                  <p className="mt-1 font-semibold text-slate-950">{contractorId ? "Filtered contractor report" : "All contractors"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl bg-moonext-navy p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Gross Payroll</p>
                <p className="mt-3 text-2xl font-semibold">{formatCurrency(totals.gross)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Paid</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(totals.paid)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pending</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(totals.pending)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Workers</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{records.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Payroll Breakdown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1500px] text-[10px] leading-5 text-slate-700">
                <thead className="bg-slate-100 text-left uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Labour</th>
                    <th className="px-3 py-2 font-semibold">Phone</th>
                    <th className="px-3 py-2 font-semibold">Skill</th>
                    <th className="px-3 py-2 font-semibold">Site</th>
                    <th className="px-3 py-2 font-semibold">State</th>
                    <th className="px-3 py-2 font-semibold">Contractor</th>
                    <th className="px-3 py-2 font-semibold">Present</th>
                    <th className="px-3 py-2 font-semibold">FT Days</th>
                    <th className="px-3 py-2 font-semibold">HT Days</th>
                    <th className="px-3 py-2 font-semibold">OT Hrs</th>
                    <th className="px-3 py-2 font-semibold">FT Pay</th>
                    <th className="px-3 py-2 font-semibold">HT Pay</th>
                    <th className="px-3 py-2 font-semibold">OT Pay</th>
                    <th className="px-3 py-2 font-semibold">Gross</th>
                    <th className="px-3 py-2 font-semibold">Paid</th>
                    <th className="px-3 py-2 font-semibold">Pending</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length ? (
                    records.map((record) => (
                      <tr key={record.id} className="border-t border-slate-200 align-top">
                        <td className="px-3 py-2 font-semibold text-slate-900">{record.labour.fullName}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{record.labour.phone}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{record.labour.skillType}</td>
                        <td className="px-3 py-2">{record.site.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{record.site.state}</td>
                        <td className="px-3 py-2">{record.contractor.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{Number(record.presentDays)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{Number(record.fullTimeDays)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{Number(record.halfTimeDays)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{Number(record.overtimeHours)}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(record.fullTimePay))}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(record.halfTimePay))}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(record.overtimePay))}</td>
                        <td className="px-3 py-2 whitespace-nowrap font-semibold text-slate-900">{formatCurrency(Number(record.grossAmount))}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(record.paidAmount))}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(record.pendingAmount))}</td>
                        <td className="px-3 py-2 whitespace-nowrap font-semibold">{record.paymentStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={17} className="px-4 py-8 text-center text-sm text-slate-500">
                        No payroll records found for the selected period and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>This document is system generated for payroll review and contractor settlement.</p>
            <p>Total overtime hours: <span className="font-semibold text-slate-700">{totals.overtimeHours.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-36 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#2f2d96]" />
          <div className="absolute inset-x-[-4%] bottom-16 h-16 rounded-[100%] bg-[#f7931a]" />
          <div className="absolute inset-x-[-6%] bottom-[3.65rem] h-10 rounded-[100%] bg-white" />
          <div className="absolute inset-x-[-8%] bottom-[4.55rem] h-6 rounded-[100%] border-t-4 border-[#2f2d96]" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-8 pb-5 text-sm font-semibold text-white">
            <div>
              <p>Contact: 6203209812, 8750186788</p>
              <p>E-mail: vishnu.moonext@gmail.com</p>
            </div>
            <div className="text-right">
              <p>Moonext Constructions Pvt. Ltd.</p>
              <p>Official Payroll Letterhead</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
