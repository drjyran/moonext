import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { phone, message } = await request.json();
  if (!phone || !message) return NextResponse.json({ error: "phone and message are required" }, { status: 400 });

  return NextResponse.json({
    message: "SMS notification queued (placeholder)",
    provider: "twilio-placeholder"
  });
}
