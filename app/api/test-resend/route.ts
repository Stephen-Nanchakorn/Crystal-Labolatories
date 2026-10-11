// app/api/test-resend/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  // ✅ Block in production to prevent information leakage and email spam
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY is not set"
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Crystal Labs Test <onboarding@resend.dev>",
      to: ["other2551.work@gmail.com"],
      subject: "Test from Crystal Labs (Development)",
      html: "<strong>Development Test Email</strong>",
      text: "Development Test Email",
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Development test email sent successfully",
      emailId: data?.id,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to send email"
    }, { status: 500 });
  }
}
