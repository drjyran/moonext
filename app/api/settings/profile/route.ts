import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { setAuthCookieForUser } from "@/lib/auth";

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || /^\d{10}$/.test(value), "Phone must be 10 digits");

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: phoneSchema
});

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      siteId: true,
      contractorId: true,
      site: { select: { name: true } },
      contractor: { select: { name: true } }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    siteId: user.siteId,
    contractorId: user.contractorId,
    siteName: user.site?.name ?? null,
    contractorName: user.contractor?.name ?? null
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone?.trim() || null
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        siteId: true,
        contractorId: true,
        site: { select: { name: true } },
        contractor: { select: { name: true } }
      }
    });

    await setAuthCookieForUser({
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role,
      siteId: updated.siteId,
      contractorId: updated.contractorId
    });

    return NextResponse.json({
      message: "Profile updated",
      user: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone ?? "",
        role: updated.role,
        siteId: updated.siteId,
        contractorId: updated.contractorId,
        siteName: updated.site?.name ?? null,
        contractorName: updated.contractor?.name ?? null
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email or phone already exists" }, { status: 409 });
    }

    console.error("Profile update failed:", error);
    return NextResponse.json({ error: "Unable to update profile" }, { status: 500 });
  }
}
