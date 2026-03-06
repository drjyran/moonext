import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const createSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  aadhaarNumber: z.string().length(12),
  skillType: z.string().min(2),
  dailyWage: z.coerce.number().positive(),
  contractorId: z.string().min(1),
  assignedSiteId: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  aadhaarDocUrl: z.string().optional(),
  photoUrl: z.string().optional()
});
function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const labours = await prisma.labour.findMany({
    where:
      user.role === Role.ADMIN
        ? {}
        : isSiteScopedRole(user.role)
          ? { assignedSiteId: user.siteId ?? "" }
          : { contractorId: user.contractorId ?? "" },
    include: {
      assignedSite: { select: { id: true, name: true, city: true } },
      contractor: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(labours);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER, Role.PROJECT_MANAGER, Role.SITE_SUPERVISOR]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (isSiteScopedRole(auth.user.role) && auth.user.siteId !== parsed.data.assignedSiteId) {
    return NextResponse.json({ error: "Cannot assign outside your site" }, { status: 403 });
  }

  const labour = await prisma.labour.create({
    data: {
      ...parsed.data,
      dailyWage: parsed.data.dailyWage
    }
  });

  return NextResponse.json(labour, { status: 201 });
}
