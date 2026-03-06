import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const bulkSchema = z.object({
  siteId: z.string(),
  date: z.string(),
  records: z.array(
    z.object({
      labourId: z.string(),
      shiftType: z.enum(["FULL_TIME", "HALF_TIME", "OVER_TIME", "ABSENT"]),
      overtimeHours: z.coerce.number().min(0).max(24).optional(),
      workDescription: z.string().max(500).optional()
    })
  )
});

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const date = request.nextUrl.searchParams.get("date");
  const siteId = request.nextUrl.searchParams.get("siteId");

  const where: Record<string, unknown> = {
    ...(date ? { date: new Date(date) } : {}),
    ...(siteId ? { siteId } : {}),
    ...(result.user.role === Role.SITE_MANAGER ? { siteId: result.user.siteId ?? "" } : {}),
    ...(result.user.role === Role.CONTRACTOR
      ? { labour: { contractorId: result.user.contractorId ?? "" } }
      : {})
  };

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      labour: { select: { id: true, fullName: true, skillType: true } },
      site: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(attendance);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (auth.user.role === Role.SITE_MANAGER && auth.user.siteId !== parsed.data.siteId) {
    return NextResponse.json({ error: "Cannot mark attendance for another site" }, { status: 403 });
  }

  const date = new Date(parsed.data.date);

  await prisma.$transaction(
    parsed.data.records.map((record) =>
      prisma.attendance.upsert({
        where: {
          labourId_date: {
            labourId: record.labourId,
            date
          }
        },
        create: {
          labourId: record.labourId,
          siteId: parsed.data.siteId,
          date,
          status:
            record.shiftType === "FULL_TIME"
              ? "PRESENT"
              : record.shiftType === "HALF_TIME"
                ? "HALF_DAY"
                : record.shiftType === "OVER_TIME"
                  ? "OVERTIME"
                  : "ABSENT",
          shiftType: record.shiftType,
          overtimeHours: record.shiftType === "OVER_TIME" ? (record.overtimeHours ?? 2) : 0,
          workDescription: record.workDescription
        },
        update: {
          status:
            record.shiftType === "FULL_TIME"
              ? "PRESENT"
              : record.shiftType === "HALF_TIME"
                ? "HALF_DAY"
                : record.shiftType === "OVER_TIME"
                  ? "OVERTIME"
                  : "ABSENT",
          shiftType: record.shiftType,
          overtimeHours: record.shiftType === "OVER_TIME" ? (record.overtimeHours ?? 2) : 0,
          workDescription: record.workDescription,
          siteId: parsed.data.siteId
        }
      })
    )
  );

  return NextResponse.json({ message: "Attendance saved" });
}
