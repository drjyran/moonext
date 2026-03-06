import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const schema = z.object({
  labourId: z.string().optional(),
  contractorId: z.string().optional(),
  siteId: z.string().optional(),
  amount: z.coerce.number().positive(),
  notes: z.string().max(500).optional(),
  status: z.nativeEnum(PaymentStatus).optional()
});

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const where = {
    ...(isSiteScopedRole(user.role) ? { siteId: user.siteId ?? "" } : {}),
    ...(user.role === Role.CONTRACTOR ? { contractorId: user.contractorId ?? "" } : {})
  };

  const payments = await prisma.payment.findMany({
    where,
    include: {
      labour: { select: { fullName: true } },
      contractor: { select: { name: true } },
      site: { select: { name: true } }
    },
    orderBy: { paidAt: "desc" }
  });

  return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN, Role.ACCOUNTANT, Role.SITE_MANAGER, Role.PROJECT_MANAGER]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (isSiteScopedRole(auth.user.role) && parsed.data.siteId && auth.user.siteId !== parsed.data.siteId) {
    return NextResponse.json({ error: "Cannot create payment for another site" }, { status: 403 });
  }

  const payment = await prisma.payment.create({
    data: {
      labourId: parsed.data.labourId,
      contractorId: parsed.data.contractorId,
      siteId: parsed.data.siteId,
      amount: parsed.data.amount,
      notes: parsed.data.notes,
      status: parsed.data.status ?? PaymentStatus.PAID
    }
  });

  return NextResponse.json(payment, { status: 201 });
}
