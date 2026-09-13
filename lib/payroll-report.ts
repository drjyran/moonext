import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PayrollReportInput = {
  month: number;
  year: number;
  siteId?: string;
  contractorId?: string;
  role: Role;
  userSiteId?: string | null;
  userContractorId?: string | null;
};

const payrollInclude = {
  labour: { select: { fullName: true, phone: true, skillType: true } },
  site: { select: { name: true, state: true } },
  contractor: { select: { name: true } }
} satisfies Prisma.WageRecordInclude;

export async function getPayrollReportRecords(input: PayrollReportInput) {
  return prisma.wageRecord.findMany({
    where: {
      month: input.month,
      year: input.year,
      ...(input.siteId ? { siteId: input.siteId } : {}),
      ...(input.contractorId ? { contractorId: input.contractorId } : {}),
      ...(input.role === Role.SITE_MANAGER ? { siteId: input.userSiteId ?? "" } : {}),
      ...(input.role === Role.CONTRACTOR ? { contractorId: input.userContractorId ?? "" } : {})
    },
    include: payrollInclude,
    orderBy: [{ siteId: "asc" }, { contractorId: "asc" }, { labourId: "asc" }]
  });
}

export type PayrollReportRecord = Awaited<ReturnType<typeof getPayrollReportRecords>>[number];

export function createPayrollCsvRows(records: PayrollReportRecord[], month: number, year: number) {
  return records.map((record) => ({
    Month: month,
    Year: year,
    Labour: record.labour.fullName,
    Phone: record.labour.phone,
    Skill: record.labour.skillType,
    Site: record.site.name,
    State: record.site.state,
    Contractor: record.contractor.name,
    PresentDays: Number(record.presentDays),
    FullTimeDays: Number(record.fullTimeDays),
    HalfTimeDays: Number(record.halfTimeDays),
    OverTimeHours: Number(record.overtimeHours),
    FullTimePay: Number(record.fullTimePay),
    HalfTimePay: Number(record.halfTimePay),
    OverTimePay: Number(record.overtimePay),
    GrossAmount: Number(record.grossAmount),
    PaidAmount: Number(record.paidAmount),
    PendingAmount: Number(record.pendingAmount),
    Status: record.paymentStatus
  }));
}
