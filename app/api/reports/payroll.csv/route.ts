import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const month = Number(request.nextUrl.searchParams.get("month") || new Date().getMonth() + 1);
  const year = Number(request.nextUrl.searchParams.get("year") || new Date().getFullYear());
  const siteId = request.nextUrl.searchParams.get("siteId") || undefined;
  const contractorId = request.nextUrl.searchParams.get("contractorId") || undefined;

  const records = await prisma.wageRecord.findMany({
    where: {
      month,
      year,
      ...(siteId ? { siteId } : {}),
      ...(contractorId ? { contractorId } : {}),
      ...(result.user.role === Role.SITE_MANAGER ? { siteId: result.user.siteId ?? "" } : {}),
      ...(result.user.role === Role.CONTRACTOR ? { contractorId: result.user.contractorId ?? "" } : {})
    },
    include: {
      labour: { select: { fullName: true, phone: true, skillType: true } },
      site: { select: { name: true, state: true } },
      contractor: { select: { name: true } }
    }
  });

  const csv = stringify(
    records.map((record) => ({
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
    })),
    { header: true }
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=payroll-${month}-${year}.csv`
    }
  });
}
