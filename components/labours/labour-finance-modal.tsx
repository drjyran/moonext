"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";
import {
  defaultDeductibleByTransactionType,
  fareTypes,
  getFareTypeLabel,
  getPaymentCycleLabel,
  getPaymentModeLabel,
  getTransactionLabel,
  labourTransactionLabels,
  manualLabourTransactionTypes,
  transactionPaymentModes,
  type FareTypeValue,
  type LabourPaymentCycleValue,
  type LabourSettlementSummary,
  type ManualLabourTransactionTypeValue,
  type TransactionPaymentModeValue
} from "@/lib/labour-finance";
import { formatCurrency, formatDate } from "@/lib/utils";

type LabourFinanceSummary = LabourSettlementSummary;

type WageSnapshot = {
  id: string;
  month: number;
  year: number;
  grossAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: "PENDING" | "PAID";
};

type LedgerTransaction = {
  id: string;
  type: keyof typeof labourTransactionLabels;
  label: string;
  amount: number;
  paymentMode: TransactionPaymentModeValue;
  transactionDate: string;
  remarks: string | null;
  deductibleFromWages: boolean;
  fareType: FareTypeValue | null;
  fromLocation: string | null;
  toLocation: string | null;
  travelDate: string | null;
  runningBalance: number;
};

type LabourFinanceResponse = {
  labour: {
    id: string;
    fullName: string;
    skillType: string;
    phone: string;
    paymentCycle: LabourPaymentCycleValue;
    paymentCycleLabel: string;
    dailyWage: number;
    monthlyWage: number | null;
    assignedSite: { id: string; name: string };
    contractor: { id: string; name: string };
  };
  summary: LabourFinanceSummary;
  wages: WageSnapshot[];
  transactions: LedgerTransaction[];
};

type Props = {
  labourId: string | null;
  open: boolean;
  onClose: () => void;
};

type TransactionFormState = {
  type: ManualLabourTransactionTypeValue;
  amount: string;
  paymentMode: TransactionPaymentModeValue;
  transactionDate: string;
  remarks: string;
  deductibleFromWages: boolean;
  fareType: FareTypeValue;
  fromLocation: string;
  toLocation: string;
  travelDate: string;
};

const defaultTransactionType: ManualLabourTransactionTypeValue = "ADVANCE";

const defaultForm: TransactionFormState = {
  type: defaultTransactionType,
  amount: "",
  paymentMode: "CASH",
  transactionDate: new Date().toISOString().slice(0, 10),
  remarks: "",
  deductibleFromWages: defaultDeductibleByTransactionType[defaultTransactionType],
  fareType: "LOCAL",
  fromLocation: "",
  toLocation: "",
  travelDate: new Date().toISOString().slice(0, 10)
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

function getMonthLabel(month: number, year: number) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function getSummaryCards(summary: LabourFinanceSummary) {
  return [
    { label: "Earned Wages", value: formatCurrency(summary.totalEarnedWages), tone: "text-slate-900" },
    { label: "Deductible Total", value: formatCurrency(summary.deductibleTotal), tone: "text-rose-600" },
    { label: "Bonus", value: formatCurrency(summary.totalBonus), tone: "text-emerald-600" },
    { label: "Net Payable", value: formatCurrency(summary.netPayable), tone: "text-slate-900" },
    { label: "Pending Balance", value: formatCurrency(summary.pendingAmount), tone: "text-moonext-orange" }
  ];
}

export function LabourFinanceModal({ labourId, open, onClose }: Props) {
  const { pushToast } = useToast();
  const [data, setData] = useState<LabourFinanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<TransactionFormState>(defaultForm);
  const [filters, setFilters] = useState({
    type: "",
    dateFrom: "",
    dateTo: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryCards = useMemo(() => (data ? getSummaryCards(data.summary) : []), [data]);

  async function loadFinanceData() {
    if (!open || !labourId) return;

    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    const res = await fetch(`/api/labours/${labourId}/transactions${params.size ? `?${params.toString()}` : ""}`);
    setLoading(false);
    if (!res.ok) return pushToast(await getError(res), "error");
    setData((await res.json()) as LabourFinanceResponse);
  }

  useEffect(() => {
    void loadFinanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, labourId, filters.type, filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setErrors({});
      setFilters({ type: "", dateFrom: "", dateTo: "" });
      setData(null);
    }
  }, [open]);

  function setType(type: ManualLabourTransactionTypeValue) {
    setForm((prev) => ({
      ...prev,
      type,
      deductibleFromWages: defaultDeductibleByTransactionType[type],
      fareType: "LOCAL",
      fromLocation: "",
      toLocation: "",
      travelDate: prev.travelDate || new Date().toISOString().slice(0, 10)
    }));
  }

  function validateForm(value: TransactionFormState) {
    const next: Record<string, string> = {};
    if (!value.type) next.type = "Transaction type is required";
    if (!value.amount || Number(value.amount) <= 0) next.amount = "Amount must be greater than 0";
    if (!value.transactionDate) next.transactionDate = "Date is required";
    if (value.type === "FARE") {
      if (!value.fareType) next.fareType = "Fare type is required";
      if (!value.travelDate) next.travelDate = "Travel date is required";
    }
    return next;
  }

  async function createTransaction() {
    if (!labourId) return;
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const res = await fetch(`/api/labours/${labourId}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.type,
        amount: Number(form.amount),
        paymentMode: form.paymentMode,
        transactionDate: form.transactionDate,
        remarks: form.remarks,
        deductibleFromWages: form.deductibleFromWages,
        ...(form.type === "FARE"
          ? {
              fareType: form.fareType,
              fromLocation: form.fromLocation,
              toLocation: form.toLocation,
              travelDate: form.travelDate
            }
          : {})
      })
    });
    setSubmitting(false);

    if (!res.ok) return pushToast(await getError(res), "error");

    pushToast("Transaction recorded");
    setForm({
      ...defaultForm,
      transactionDate: form.transactionDate,
      travelDate: form.travelDate
    });
    setErrors({});
    await loadFinanceData();
  }

  return (
    <Modal
      open={open}
      title={data ? `${data.labour.fullName} · Transactions & Settlement` : "Transactions & Settlement"}
      onClose={onClose}
      panelClassName="max-w-6xl"
    >
      {loading && !data ? <p className="text-sm text-slate-500">Loading labour finance data...</p> : null}

      {data ? (
        <div className="space-y-6">
          <section className="rounded-2xl bg-moonext-navy px-5 py-4 text-white">
            <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Labour Ledger</p>
                <h4 className="text-xl font-semibold">{data.labour.fullName}</h4>
                <p className="text-sm text-blue-100/90">
                  {data.labour.skillType} · {data.labour.assignedSite.name} · {data.labour.contractor.name}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Payment Basis</p>
                  <p className="mt-2 text-sm font-semibold text-white">{getPaymentCycleLabel(data.labour.paymentCycle)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Configured Wage</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {data.labour.paymentCycle === "MONTHLY"
                      ? formatCurrency(data.labour.monthlyWage || 0)
                      : formatCurrency(data.labour.dailyWage)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Phone</p>
                  <p className="mt-2 text-sm font-semibold text-white">{data.labour.phone}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card) => (
              <div key={card.label} className="surface-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                <p className={`mt-3 text-xl font-semibold ${card.tone}`}>{card.value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MiniSummaryCard
              label="Advance"
              value={formatCurrency(data.summary.totalAdvances)}
              meta={`Deductible ${formatCurrency(data.summary.deductibleAdvances)}`}
            />
            <MiniSummaryCard
              label="Food"
              value={formatCurrency(data.summary.totalFoodExpenses)}
              meta={`Deductible ${formatCurrency(data.summary.deductibleFoodExpenses)}`}
            />
            <MiniSummaryCard
              label="Medical"
              value={formatCurrency(data.summary.totalMedicalExpenses)}
              meta={`Deductible ${formatCurrency(data.summary.deductibleMedicalExpenses)}`}
            />
            <MiniSummaryCard
              label="Fare"
              value={formatCurrency(data.summary.totalFare)}
              meta={`Deductible ${formatCurrency(data.summary.deductibleFare)}`}
            />
            <MiniSummaryCard
              label="Miscellaneous"
              value={formatCurrency(data.summary.totalMiscExpenses)}
              meta={`Deductible ${formatCurrency(data.summary.deductibleMiscExpenses)}`}
            />
            <MiniSummaryCard
              label="Deductions"
              value={formatCurrency(data.summary.totalDeductions)}
              meta={`Adjustments ${formatCurrency(data.summary.totalAdjustments)}`}
            />
            <MiniSummaryCard
              label="Wage Payments"
              value={formatCurrency(data.summary.totalWagePayments)}
              meta={`Overpaid ${formatCurrency(data.summary.overpaidAmount)}`}
            />
            <MiniSummaryCard
              label="Non-deductible"
              value={formatCurrency(data.summary.nonDeductibleExpenseTotal)}
              meta="Tracked separately from wage settlement"
            />
          </section>

          <section className="surface-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Add Transaction / Expense</h4>
                <p className="mt-1 text-sm text-slate-600">
                  Record advances, food, medical, fare, misc expenses, bonus, deduction, or adjustments.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FormField label="Transaction Type" required error={errors.type}>
                <Select value={form.type} onChange={(e) => setType(e.target.value as ManualLabourTransactionTypeValue)}>
                  {manualLabourTransactionTypes.map((type) => (
                    <option key={type} value={type}>{getTransactionLabel(type)}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Amount" required error={errors.amount}>
                <Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </FormField>

              <FormField label="Payment Mode">
                <Select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value as TransactionPaymentModeValue })}>
                  {transactionPaymentModes.map((mode) => (
                    <option key={mode} value={mode}>{getPaymentModeLabel(mode)}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Transaction Date" required error={errors.transactionDate}>
                <Input type="date" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} />
              </FormField>

              <FormField label="Deduct from Wages">
                <Select
                  value={form.deductibleFromWages ? "yes" : "no"}
                  onChange={(e) => setForm({ ...form, deductibleFromWages: e.target.value === "yes" })}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </FormField>

              <FormField label="Remarks" hint="Optional but useful for audit trail">
                <Input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Reason or note" />
              </FormField>

              {form.type === "FARE" ? (
                <>
                  <FormField label="Fare Type" required error={errors.fareType}>
                    <Select value={form.fareType} onChange={(e) => setForm({ ...form, fareType: e.target.value as FareTypeValue })}>
                      {fareTypes.map((type) => (
                        <option key={type} value={type}>{getFareTypeLabel(type)}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="From Location">
                    <Input value={form.fromLocation} onChange={(e) => setForm({ ...form, fromLocation: e.target.value })} placeholder="From" />
                  </FormField>
                  <FormField label="To Location">
                    <Input value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value })} placeholder="To" />
                  </FormField>
                  <FormField label="Travel Date" required error={errors.travelDate}>
                    <Input type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} />
                  </FormField>
                </>
              ) : null}
            </div>

            <div className="mt-4">
              <Button onClick={createTransaction} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Saving..." : "Record Transaction"}
              </Button>
            </div>
          </section>

          <section className="surface-card p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Ledger History</h4>
                <p className="mt-1 text-sm text-slate-600">Filter by date or transaction type when you need a narrower view.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[560px]">
                <Select value={filters.type} onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}>
                  <option value="">All Types</option>
                  {Object.keys(labourTransactionLabels).map((type) => (
                    <option key={type} value={type}>{getTransactionLabel(type as keyof typeof labourTransactionLabels)}</option>
                  ))}
                </Select>
                <Input type="date" value={filters.dateFrom} onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))} />
                <Input type="date" value={filters.dateTo} onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))} />
              </div>
            </div>

            <div className="table-shell">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="table-base min-w-[1180px]">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Payment Mode</th>
                      <th className="px-3 py-2">Deductible</th>
                      <th className="px-3 py-2">Remarks</th>
                      <th className="px-3 py-2">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.length ? (
                      data.transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-slate-200 align-top">
                          <td className="px-3 py-2 whitespace-nowrap">{formatDate(transaction.transactionDate)}</td>
                          <td className="px-3 py-2">
                            <div className="space-y-1">
                              <p className="font-medium text-slate-900">{transaction.label}</p>
                              {transaction.fareType ? (
                                <p className="text-xs text-slate-500">
                                  {getFareTypeLabel(transaction.fareType)}
                                  {transaction.fromLocation || transaction.toLocation
                                    ? ` · ${transaction.fromLocation || "?"} to ${transaction.toLocation || "?"}`
                                    : ""}
                                </p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-900">{formatCurrency(transaction.amount)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{getPaymentModeLabel(transaction.paymentMode)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{transaction.deductibleFromWages ? "Yes" : "No"}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{transaction.remarks || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap font-medium">{formatCurrency(transaction.runningBalance)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                          No transactions found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="surface-card p-5">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-slate-900">Wage Cycles</h4>
              <p className="mt-1 text-sm text-slate-600">Recent wage records help compare earned amounts with settlement and payments.</p>
            </div>

            <div className="table-shell">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="table-base min-w-[760px]">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-3 py-2">Cycle</th>
                      <th className="px-3 py-2">Gross</th>
                      <th className="px-3 py-2">Paid</th>
                      <th className="px-3 py-2">Pending</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.wages.length ? (
                      data.wages.map((wage) => (
                        <tr key={wage.id} className="border-t border-slate-200">
                          <td className="px-3 py-2 font-medium text-slate-900">{getMonthLabel(wage.month, wage.year)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(wage.grossAmount)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(wage.paidAmount)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(wage.pendingAmount)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{wage.paymentStatus}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                          No wage records generated yet for this labour.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </Modal>
  );
}

function MiniSummaryCard({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </div>
  );
}
