"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";

type Forecast = {
  siteId: string;
  siteName: string;
  projectedAdditionalWorkersNextWeek: number;
  shortageRisk: "LOW" | "MEDIUM" | "HIGH";
  insight: string;
};

type ResponseData = {
  generatedAt: string;
  insights: Forecast[];
  costAnalysis: { grossPayroll: number; pendingPayroll: number };
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function AIInsightsPage() {
  const { pushToast } = useToast();
  const [data, setData] = useState<ResponseData | null>(null);

  useEffect(() => {
    fetch("/api/ai/forecast").then(async (res) => {
      if (!res.ok) return pushToast(await getError(res), "error");
      setData(await res.json());
    });
  }, [pushToast]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">AI Forecast & Productivity Insights</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-4">
          <p className="text-sm text-slate-500">Gross Payroll (This Month)</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">INR {Number(data?.costAnalysis.grossPayroll || 0).toLocaleString("en-IN")}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-sm text-slate-500">Pending Payroll</p>
          <p className="mt-2 text-2xl font-bold text-red-600">INR {Number(data?.costAnalysis.pendingPayroll || 0).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {data?.insights.map((row) => (
          <div key={row.siteId} className="surface-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">{row.siteName}</h3>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.shortageRisk === "HIGH" ? "bg-red-100 text-red-700" : row.shortageRisk === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {row.shortageRisk} risk
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{row.insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
