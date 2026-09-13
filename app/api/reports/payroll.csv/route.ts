import { NextRequest } from "next/server";
import { stringify } from "csv-stringify/sync";
import { requireUser } from "@/lib/api";
import { createPayrollCsvRows, getPayrollReportRecords } from "@/lib/payroll-report";
import { getPeriodTransactionMap, getWageSettlement } from "@/lib/labour-settlement";

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const month = Number(request.nextUrl.searchParams.get("month") || new Date().getMonth() + 1);
  const year = Number(request.nextUrl.searchParams.get("year") || new Date().getFullYear());
  const siteId = request.nextUrl.searchParams.get("siteId") || undefined;
  const contractorId = request.nextUrl.searchParams.get("contractorId") || undefined;

  const records = await getPayrollReportRecords({
    month,
    year,
    siteId,
    contractorId,
    role: result.user.role,
    userSiteId: result.user.siteId,
    userContractorId: result.user.contractorId
  });

  const transactionMap = await getPeriodTransactionMap(
    records.map((record) => record.labourId),
    month,
    year
  );
  const rows = createPayrollCsvRows(records, month, year).map((row, index) => {
    const record = records[index];
    const settlement = getWageSettlement(
      Number(record.grossAmount),
      Number(record.paidAmount),
      transactionMap.get(record.labourId) || []
    );

    return {
      ...row,
      DeductibleTotal: settlement.deductibleTotal,
      Bonus: settlement.totalBonus,
      NetPayable: settlement.netPayable,
      SettlementPending: settlement.pendingAmount
    };
  });

  const csv = stringify(rows, { header: true });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=payroll-${month}-${year}.csv`
    }
  });
}
