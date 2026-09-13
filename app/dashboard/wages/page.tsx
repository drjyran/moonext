"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import { transactionPaymentModes, type TransactionPaymentModeValue } from "@/lib/labour-finance";
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
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: "PENDING" | "PAID";
  labour: {
    fullName: string;
    paymentCycle: "DAILY" | "MONTHLY";
    monthlyWage: number | null;
  };
  site: { name: string };
  contractor: { name: string };
  settlement: {
    deductibleTotal: number;
    totalBonus: number;
    totalAdvances: number;
    totalFoodExpenses: number;
    totalMedicalExpenses: number;
    totalFare: number;
    totalMiscExpenses: number;
    totalDeductions: number;
    netPayable: number;
    pendingAmount: number;
  };
};

type PaymentForm = {
  paidAmount: string;
  paymentMode: TransactionPaymentModeValue;
  transactionDate: string;
  remarks: string;
};

const defaultPaymentForm: PaymentForm = {
  paidAmount: "",
  paymentMode: "CASH",
  transactionDate: new Date().toISOString().slice(0, 10),
  remarks: ""
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
  const [paymentRow, setPaymentRow] = useState<Wage | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>(defaultPaymentForm);

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
    pushToast("Wages generated with settlement adjustments");
    load();
  }

  function openPayment(row: Wage) {
    setPaymentRow(row);
    setPaymentForm({
      paidAmount: String(row.settlement.pendingAmount || row.pendingAmount || row.grossAmount),
      paymentMode: "CASH",
      transactionDate: new Date().toISOString().slice(0, 10),
      remarks: `Settlement for ${row.labour.fullName} (${String(row.month).padStart(2, "0")}/${row.year})`
    });
  }

  async function submitPayment() {
    if (!paymentRow) return;

    setActionKey(`paid:${paymentRow.id}`);
    const res = await fetch(`/api/wages/${paymentRow.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...paymentForm,
        paidAmount: Number(paymentForm.paidAmount)
      })
    });
    setActionKey(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast("Settlement payment updated");
    setPaymentRow(null);
    setPaymentForm(defaultPaymentForm);
    load();
  }

  const paymentInvalid = !paymentForm.paidAmount || Number(paymentForm.paidAmount) < 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wage Calculation & Settlement</h2>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-5">
        <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} />
        <Input type="number" min={2020} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        <Button onClick={generate} disabled={actionKey === "generate"} className="w-full xl:w-auto">{actionKey === "generate" ? "Generating..." : "Generate Wages"}</Button>
        <a
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-moonext-navy px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-900 sm:min-h-11"
          href={`/reports/payroll?month=${month}&year=${year}&print=1`}
          target="_blank"
          rel="noreferrer"
        >
          Letterhead Report
        </a>
        <a className="inline-flex min-h-10 items-center justify-center rounded-lg bg-moonext-orange px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-600 sm:min-h-11" href={`/api/reports/payroll.csv?month=${month}&year=${year}`}>
          Export Payroll CSV
        </a>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="table-base min-w-[1560px]">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-2">Labour</th>
                <th className="px-3 py-2">Site</th>
                <th className="px-3 py-2">Payment Basis</th>
                <th className="px-3 py-2">Gross</th>
                <th className="px-3 py-2">Adv.</th>
                <th className="px-3 py-2">Food</th>
                <th className="px-3 py-2">Medical</th>
                <th className="px-3 py-2">Fare</th>
                <th className="px-3 py-2">Misc.</th>
                <th className="px-3 py-2">Bonus</th>
                <th className="px-3 py-2">Deductions</th>
                <th className="px-3 py-2">Net Payable</th>
                <th className="px-3 py-2">Paid</th>
                <th className="px-3 py-2">Pending</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <p className="font-medium whitespace-nowrap">{row.labour.fullName}</p>
                      <p className="text-xs text-slate-500 whitespace-nowrap">{row.contractor.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.site.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.labour.paymentCycle === "MONTHLY" ? "Monthly Salary" : "Daily Wage"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold">{formatCurrency(Number(row.grossAmount))}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(row.settlement.totalAdvances)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(row.settlement.totalFoodExpenses)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(row.settlement.totalMedicalExpenses)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(row.settlement.totalFare)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(row.settlement.totalMiscExpenses)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-emerald-700">{formatCurrency(row.settlement.totalBonus)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-rose-600">{formatCurrency(row.settlement.deductibleTotal)}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold">{formatCurrency(row.settlement.netPayable)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(Number(row.paidAmount))}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-semibold">{formatCurrency(row.settlement.pendingAmount)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.settlement.pendingAmount === 0 ? "PAID" : "PENDING"}</td>
                  <td className="px-3 py-2">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto"
                      onClick={() => openPayment(row)}
                      disabled={row.settlement.pendingAmount === 0 || actionKey === `paid:${row.id}`}
                    >
                      {actionKey === `paid:${row.id}` ? "Updating..." : "Settle Payment"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!paymentRow}
        title={paymentRow ? `Settle ${paymentRow.labour.fullName}` : "Settle Payment"}
        onClose={() => setPaymentRow(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setPaymentRow(null)}>Cancel</Button>
            <Button onClick={submitPayment} disabled={!paymentRow || paymentInvalid || actionKey === `paid:${paymentRow?.id}`} className="w-full sm:w-auto">
              {paymentRow && actionKey === `paid:${paymentRow.id}` ? "Saving..." : "Save Payment"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p><span className="font-semibold text-slate-900">Gross:</span> {paymentRow ? formatCurrency(paymentRow.grossAmount) : "-"}</p>
            <p><span className="font-semibold text-slate-900">Net Payable:</span> {paymentRow ? formatCurrency(paymentRow.settlement.netPayable) : "-"}</p>
            <p><span className="font-semibold text-slate-900">Pending:</span> {paymentRow ? formatCurrency(paymentRow.settlement.pendingAmount) : "-"}</p>
          </div>
          <FormFieldLike label="Paid Amount">
            <Input
              type="number"
              min={0}
              value={paymentForm.paidAmount}
              onChange={(e) => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })}
            />
          </FormFieldLike>
          <FormFieldLike label="Payment Mode">
            <Select
              value={paymentForm.paymentMode}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value as TransactionPaymentModeValue })}
            >
              {transactionPaymentModes.map((mode) => <option key={mode} value={mode}>{mode.replaceAll("_", " ")}</option>)}
            </Select>
          </FormFieldLike>
          <FormFieldLike label="Payment Date">
            <Input
              type="date"
              value={paymentForm.transactionDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionDate: e.target.value })}
            />
          </FormFieldLike>
          <FormFieldLike label="Remarks">
            <Input
              value={paymentForm.remarks}
              onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
              placeholder="Optional remarks"
            />
          </FormFieldLike>
        </div>
      </Modal>
    </div>
  );
}

function FormFieldLike({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
