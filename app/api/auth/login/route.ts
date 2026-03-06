import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await createToken({ userId: user.id, role: user.role });
    await setAuthCookie(token);

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login route failed:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
