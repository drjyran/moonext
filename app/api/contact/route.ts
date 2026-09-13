import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(80),
  companyName: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("A valid email is required."),
  phone: z.string().trim().min(7, "Phone number is required.").max(20),
  service: z.string().trim().min(2, "Service is required.").max(120),
  message: z.string().trim().min(10, "Project details are required.").max(2000)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Please provide valid contact details."
      },
      { status: 400 }
    );
  }

  console.info("Moonext contact inquiry received", parsed.data);

  return NextResponse.json({
    success: true,
    message: "Inquiry received successfully."
  });
}
