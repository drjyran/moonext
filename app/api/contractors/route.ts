import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal(""))
});

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const contractors = await prisma.contractor.findMany({
    where: user.role === Role.CONTRACTOR ? { id: user.contractorId ?? "" } : {},
    include: {
      _count: { select: { labours: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(contractors);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const contractor = await prisma.contractor.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      address: parsed.data.address || null
    }
  });

  return NextResponse.json(contractor, { status: 201 });
}
