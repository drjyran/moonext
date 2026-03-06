import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (otp !== "123456") return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });

  return NextResponse.json({ message: "OTP verified (placeholder)" });
}
