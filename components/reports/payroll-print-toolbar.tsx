"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  autoPrint?: boolean;
  csvUrl: string;
};

export function PayrollPrintToolbar({ autoPrint = false, csvUrl }: Props) {
  useEffect(() => {
    if (!autoPrint) return;

    const timer = window.setTimeout(() => {
      window.print();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  return (
    <div className="print-hidden mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">Payroll Letterhead Report</p>
        <p className="text-xs text-slate-500">For best fit, use Landscape in the print dialog.</p>
      </div>

      <div className="action-stack">
        <Button type="button" onClick={() => window.print()}>
          Print Letterhead
        </Button>
        <a
          href={csvUrl}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 sm:min-h-11"
        >
          Download CSV
        </a>
        <Link
          href="/dashboard/reports"
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-moonext-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 sm:min-h-11"
        >
          Back to Reports
        </Link>
      </div>
    </div>
  );
}
