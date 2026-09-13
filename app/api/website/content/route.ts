import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/api";
import { getWebsiteContentForAdmin, saveWebsiteSection } from "@/lib/website-content-store";
import { websiteSectionKeys } from "@/lib/website-content";

const updateSchema = z.object({
  section: z.enum(websiteSectionKeys),
  value: z.unknown()
});

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const content = await getWebsiteContentForAdmin();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const auth = await requireRole(request, [Role.ADMIN]);
  if ("error" in auth) return auth.error;

  const payload = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 });
  }

  try {
    const saved = await saveWebsiteSection(parsed.data.section, parsed.data.value);
    return NextResponse.json({ message: "Website content updated", section: parsed.data.section, value: saved });
  } catch (error) {
    console.error("Website content update failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update website content" },
      { status: 500 }
    );
  }
}
