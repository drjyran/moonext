import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import {
  addRunningBalances,
  buildLabourSettlementSummary,
  defaultDeductibleByTransactionType,
  fareTypes,
  getPaymentCycleLabel,
  getTransactionLabel,
  labourTransactionTypes,
  manualLabourTransactionTypes,
  transactionPaymentModes
} from "@/lib/labour-finance";

const createSchema = z
  .object({
    type: z.enum(manualLabourTransactionTypes),
    amount: z.coerce.number().positive(),
    paymentMode: z.enum(transactionPaymentModes).default("CASH"),
    transactionDate: z.string().min(1),
    remarks: z.string().trim().max(500).optional(),
    deductibleFromWages: z.boolean().optional(),
    fareType: z.enum(fareTypes).optional(),
    fromLocation: z.string().trim().max(150).optional(),
    toLocation: z.string().trim().max(150).optional(),
    travelDate: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.type === "FARE") {
      if (!value.fareType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["fareType"], message: "Fare type is required" });
      }
      if (!value.travelDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["travelDate"], message: "Travel date is required" });
      }
    }

    if (value.type !== "FARE" && (value.fareType || value.fromLocation || value.toLocation || value.travelDate)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["type"], message: "Fare details are only allowed for fare entries" });
    }
  });

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

function canAccessLabour(user: { role: Role; siteId: string | null; contractorId: string | null }, labour: { assignedSiteId: string; contractorId: string }) {
  if (user.role === Role.ADMIN || user.role === Role.ACCOUNTANT) return true;
  if (isSiteScopedRole(user.role)) return labour.assignedSiteId === user.siteId;
  if (user.role === Role.CONTRACTOR) return labour.contractorId === user.contractorId;
  return false;
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const labour = await prisma.labour.findUnique({
    where: { id },
    include: {
      assignedSite: { select: { id: true, name: true } },
      contractor: { select: { id: true, name: true } }
    }
  });

  if (!labour) {
    return NextResponse.json({ error: "Labour not found" }, { status: 404 });
  }

  if (!canAccessLabour(auth.user, labour)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const typeFilter = request.nextUrl.searchParams.get("type");
  const dateFrom = request.nextUrl.searchParams.get("dateFrom");
  const dateTo = request.nextUrl.searchParams.get("dateTo");
  const type = labourTransactionTypes.includes(typeFilter as (typeof labourTransactionTypes)[number])
    ? (typeFilter as (typeof labourTransactionTypes)[number])
    : undefined;
  const fromDate = dateFrom ? parseDate(dateFrom) : null;
  const toDate = dateTo ? parseDate(dateTo) : null;

  if ((dateFrom && !fromDate) || (dateTo && !toDate)) {
    return NextResponse.json({ error: "Invalid date filter" }, { status: 400 });
  }

  const [allTransactions, filteredTransactions, wages] = await Promise.all([
    prisma.labourTransaction.findMany({
      where: { labourId: labour.id },
      orderBy: [{ transactionDate: "asc" }, { createdAt: "asc" }]
    }),
    prisma.labourTransaction.findMany({
      where: {
        labourId: labour.id,
        ...(type ? { type } : {}),
        ...(fromDate || toDate
          ? {
              transactionDate: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {})
              }
            }
          : {})
      },
      orderBy: [{ transactionDate: "asc" }, { createdAt: "asc" }]
    }),
    prisma.wageRecord.findMany({
      where: { labourId: labour.id },
      select: {
        id: true,
        month: true,
        year: true,
        grossAmount: true,
        paidAmount: true,
        pendingAmount: true,
        paymentStatus: true
      },
      orderBy: [{ year: "desc" }, { month: "desc" }]
    })
  ]);

  const summary = buildLabourSettlementSummary(wages, allTransactions);
  const ledger = addRunningBalances(filteredTransactions)
    .reverse()
    .map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      label: getTransactionLabel(transaction.type),
      runningBalance: Number(transaction.runningBalance.toFixed(2))
    }));

  return NextResponse.json({
    labour: {
      id: labour.id,
      fullName: labour.fullName,
      skillType: labour.skillType,
      phone: labour.phone,
      paymentCycle: labour.paymentCycle,
      paymentCycleLabel: getPaymentCycleLabel(labour.paymentCycle),
      dailyWage: Number(labour.dailyWage),
      monthlyWage: labour.monthlyWage ? Number(labour.monthlyWage) : null,
      assignedSite: labour.assignedSite,
      contractor: labour.contractor
    },
    summary,
    wages: wages.map((wage) => ({
      ...wage,
      grossAmount: Number(wage.grossAmount),
      paidAmount: Number(wage.paidAmount),
      pendingAmount: Number(wage.pendingAmount)
    })),
    transactions: ledger
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const labour = await prisma.labour.findUnique({
    where: { id },
    select: {
      id: true,
      assignedSiteId: true,
      contractorId: true
    }
  });

  if (!labour) {
    return NextResponse.json({ error: "Labour not found" }, { status: 404 });
  }

  if (!canAccessLabour(auth.user, labour)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const transactionDate = parseDate(parsed.data.transactionDate);
  const travelDate = parsed.data.travelDate ? parseDate(parsed.data.travelDate) : null;

  if (!transactionDate) {
    return NextResponse.json({ error: "Transaction date is required" }, { status: 400 });
  }

  if (parsed.data.type === "FARE" && !travelDate) {
    return NextResponse.json({ error: "Travel date is required" }, { status: 400 });
  }

  const transaction = await prisma.labourTransaction.create({
    data: {
      labourId: labour.id,
      siteId: labour.assignedSiteId,
      contractorId: labour.contractorId,
      type: parsed.data.type,
      amount: parsed.data.amount,
      paymentMode: parsed.data.paymentMode,
      transactionDate,
      remarks: parsed.data.remarks || null,
      deductibleFromWages:
        parsed.data.deductibleFromWages ?? defaultDeductibleByTransactionType[parsed.data.type],
      fareType: parsed.data.type === "FARE" ? parsed.data.fareType : null,
      fromLocation: parsed.data.type === "FARE" ? parsed.data.fromLocation || null : null,
      toLocation: parsed.data.type === "FARE" ? parsed.data.toLocation || null : null,
      travelDate: parsed.data.type === "FARE" ? travelDate : null,
      createdById: auth.user.id
    }
  });

  return NextResponse.json(
    {
      id: transaction.id,
      message: "Transaction recorded"
    },
    { status: 201 }
  );
}
