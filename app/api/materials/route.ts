import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1),
  siteId: z.string().min(1),
  supplier: z.string().optional(),
  purchaseDate: z.string()
});

function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const user = result.user;
  const siteId = request.nextUrl.searchParams.get("siteId");
  const where = {
    ...(siteId ? { siteId } : {}),
    ...(isSiteScopedRole(user.role) ? { siteId: user.siteId ?? "" } : {})
  };

  const materials = await prisma.material.findMany({
    where,
    include: { site: { select: { id: true, name: true, city: true } } },
    orderBy: { purchaseDate: "desc" }
  });

  return NextResponse.json(materials);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN, Role.SITE_MANAGER, Role.PROJECT_MANAGER, Role.SITE_SUPERVISOR]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (isSiteScopedRole(auth.user.role) && auth.user.siteId !== parsed.data.siteId) {
    return NextResponse.json({ error: "Cannot create material for another site" }, { status: 403 });
  }

  const material = await prisma.material.create({
    data: {
      name: parsed.data.name,
      quantity: parsed.data.quantity,
      unit: parsed.data.unit,
      siteId: parsed.data.siteId,
      supplier: parsed.data.supplier,
      purchaseDate: new Date(parsed.data.purchaseDate)
    }
  });

  return NextResponse.json(material, { status: 201 });
}
