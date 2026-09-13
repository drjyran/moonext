import {
  LabourPaymentCycle,
  LabourTransactionType,
  Prisma,
  TransactionPaymentMode,
  WageRecord
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildLabourSettlementSummary, getMonthDateRange } from "@/lib/labour-finance";

type WageTransactionShape = {
  amount: Prisma.Decimal | number;
  type: LabourTransactionType;
  deductibleFromWages: boolean;
  transactionDate: Date;
  createdAt?: Date;
  labourId?: string;
};

export function getWagePaymentTransactionType(paymentCycle: LabourPaymentCycle) {
  return paymentCycle === LabourPaymentCycle.MONTHLY
    ? LabourTransactionType.MONTHLY_SALARY_PAYMENT
    : LabourTransactionType.DAILY_WAGE_PAYMENT;
}

export function getWageSettlement(grossAmount: number, paidAmount: number, transactions: WageTransactionShape[]) {
  const summary = buildLabourSettlementSummary([{ grossAmount }], transactions);

  return {
    ...summary,
    paidAmount,
    pendingAmount: Math.max(summary.netPayable - paidAmount, 0)
  };
}

export async function getPeriodTransactionMap(labourIds: string[], month: number, year: number) {
  if (labourIds.length === 0) {
    return new Map<string, WageTransactionShape[]>();
  }

  const { start, end } = getMonthDateRange(month, year);
  const transactions = await prisma.labourTransaction.findMany({
    where: {
      labourId: { in: labourIds },
      transactionDate: { gte: start, lt: end }
    },
    select: {
      labourId: true,
      amount: true,
      type: true,
      deductibleFromWages: true,
      transactionDate: true,
      createdAt: true
    }
  });

  const map = new Map<string, WageTransactionShape[]>();

  for (const transaction of transactions) {
    const rows = map.get(transaction.labourId) || [];
    rows.push(transaction);
    map.set(transaction.labourId, rows);
  }

  return map;
}

export async function syncWagePaymentTransaction(input: {
  db?: Prisma.TransactionClient | typeof prisma;
  wageRecord: Pick<WageRecord, "id" | "labourId" | "siteId" | "contractorId" | "month" | "year">;
  paymentCycle: LabourPaymentCycle;
  paidAmount: number;
  paymentMode?: TransactionPaymentMode;
  remarks?: string | null;
  transactionDate?: Date;
  createdById?: string;
}) {
  const db = input.db || prisma;
  const type = getWagePaymentTransactionType(input.paymentCycle);
  const transactionDate =
    input.transactionDate || new Date(input.wageRecord.year, input.wageRecord.month - 1, 28);
  const remarks =
    input.remarks || `Settlement payment for ${String(input.wageRecord.month).padStart(2, "0")}/${input.wageRecord.year}`;

  if (input.paidAmount <= 0) {
    await db.labourTransaction.deleteMany({
      where: {
        wageRecordId: input.wageRecord.id
      }
    });
    return;
  }

  await db.labourTransaction.upsert({
    where: { wageRecordId: input.wageRecord.id },
    update: {
      type,
      amount: input.paidAmount,
      paymentMode: input.paymentMode || TransactionPaymentMode.CASH,
      transactionDate,
      remarks,
      deductibleFromWages: false,
      fareType: null,
      fromLocation: null,
      toLocation: null,
      travelDate: null
    },
    create: {
      wageRecordId: input.wageRecord.id,
      labourId: input.wageRecord.labourId,
      siteId: input.wageRecord.siteId,
      contractorId: input.wageRecord.contractorId,
      type,
      amount: input.paidAmount,
      paymentMode: input.paymentMode || TransactionPaymentMode.CASH,
      transactionDate,
      remarks,
      deductibleFromWages: false,
      createdById: input.createdById
    }
  });
}
