"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { formatCurrency } from "@/lib/utils";

type Wage = {
  id: string;
  month: number;
  year: number;
  presentDays: number;
  fullTimeDays: number;
  halfTimeDays: number;
  overtimeHours: number;
  fullTimePay: number;
  halfTimePay: number;
  overtimePay: number;
  grossAmount: number;
  pendingAmount: number;
  paymentStatus: "PENDING" | "PAID";
  labour: { fullName: string };
  site: { name: string };
  contractor: { name: string };
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function WagesPage() {
  const { pushToast } = useToast();
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [rows, setRows] = useState<Wage[]>([]);
  const [actionKey, setActionKey] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/wages/generate?month=${month}&year=${year}`);
    if (!res.ok) return pushToast(await getError(res), "error");
    setRows(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  async function generate() {
    setActionKey("generate");
    const res = await fetch("/api/wages/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: Number(month), year: Number(year) })
    });
    setActionKey(null);
    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast("Wages generated with full/half/overtime breakdown");
    load();
  }

  async function markPaid(row: Wage) {
    setActionKey(`paid:${row.id}`);
    const res = await fetch(`/api/wages/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidAmount: Number(row.grossAmount) })
    });
    setActionKey(null);
    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast("Payment updated to PAID");
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wage Calculation & Payment Split</h2>
      <div className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-4">
        <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} />
        <Input type="number" min={2020} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        <Button onClick={generate} disabled={actionKey === "generate"}>{actionKey === "generate" ? "Generating..." : "Generate Wages"}</Button>
        <a className="rounded-lg bg-moonext-orange px-4 py-2 text-center text-sm font-medium text-white" href={`/api/reports/payroll.csv?month=${month}&year=${year}`}>
          Export Payroll CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Labour</th>
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Full Time</th>
              <th className="px-3 py-2">Half Time</th>
              <th className="px-3 py-2">Over Time</th>
              <th className="px-3 py-2">Full Time Pay</th>
              <th className="px-3 py-2">Half Time Pay</th>
              <th className="px-3 py-2">Over Time Pay</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Pending</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.labour.fullName}</td>
                <td className="px-3 py-2">{row.site.name}</td>
                <td className="px-3 py-2">{Number(row.fullTimeDays)} d</td>
                <td className="px-3 py-2">{Number(row.halfTimeDays)} d</td>
                <td className="px-3 py-2">{Number(row.overtimeHours)} h</td>
                <td className="px-3 py-2">{formatCurrency(Number(row.fullTimePay))}</td>
                <td className="px-3 py-2">{formatCurrency(Number(row.halfTimePay))}</td>
                <td className="px-3 py-2">{formatCurrency(Number(row.overtimePay))}</td>
                <td className="px-3 py-2 font-semibold">{formatCurrency(Number(row.grossAmount))}</td>
                <td className="px-3 py-2">{formatCurrency(Number(row.pendingAmount))}</td>
                <td className="px-3 py-2">{row.paymentStatus}</td>
                <td className="px-3 py-2">
                  <Button variant="secondary" onClick={() => markPaid(row)} disabled={row.paymentStatus === "PAID" || actionKey === `paid:${row.id}`}>
                    {actionKey === `paid:${row.id}` ? "Updating..." : "Mark Paid"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
