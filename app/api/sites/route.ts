import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/api";

const createSchema = z.object({
  name: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  siteManagerId: z.string().optional(),
  projectStart: z.string(),
  projectEnd: z.string()
});
function isSiteScopedRole(role: Role) {
  return role === Role.SITE_MANAGER || role === Role.PROJECT_MANAGER || role === Role.SITE_SUPERVISOR;
}

export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("error" in result) return result.error;

  const where = isSiteScopedRole(result.user.role) ? { id: result.user.siteId ?? "" } : {};
  const sites = await prisma.site.findMany({
    where,
    include: { siteManagers: { select: { id: true, fullName: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const site = await prisma.site.create({
    data: {
      name: parsed.data.name,
      state: parsed.data.state,
      city: parsed.data.city,
      siteManagerId: parsed.data.siteManagerId,
      projectStart: new Date(parsed.data.projectStart),
      projectEnd: new Date(parsed.data.projectEnd)
    }
  });

  return NextResponse.json(site, { status: 201 });
}
