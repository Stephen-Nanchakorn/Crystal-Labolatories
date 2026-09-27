// app/api/test-resend/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not found",
        env: Object.keys(process.env).filter(k => k.includes("RESEND"))
      });
    }

    const resend = new Resend(apiKey);
    
    // ทดสอบส่งอีเมลจริง
    const { data, error } = await resend.emails.send({
      from: "Crystal Labs Test <onboarding@resend.dev>",
      to: ["other2551.work@gmail.com"], // ใส่อีเมลคุณ
      subject: "Test from Crystal Labs",
      html: "<strong>This is a test email!</strong>",
      text: "This is a test email!",
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        apiKeyPrefix: apiKey.substring(0, 10) + "..."
      });
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent!",
      emailId: data?.id,
      apiKeyPrefix: apiKey.substring(0, 10) + "..."
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}