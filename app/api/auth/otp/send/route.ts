import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { phone } = await request.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  return NextResponse.json({
    message: "OTP sent (placeholder)",
    otp: "123456"
  });
}
