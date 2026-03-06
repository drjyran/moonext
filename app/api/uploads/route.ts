import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Document/photo upload placeholder. Configure S3 or Cloudinary integration for production."
  });
}
