import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

const createSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SITE_MANAGER", "CONTRACTOR"]),
  siteId: z.string().optional(),
  contractorId: z.string().optional()
});

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      siteId: true,
      contractorId: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
      role: parsed.data.role,
      siteId: parsed.data.siteId,
      contractorId: parsed.data.contractorId
    }
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
