import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId, email, userId } = await request.json();

    // ตรวจสอบ invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        plugins:plugin_id (name)
      `)
      .eq("id", invoiceId)
      .eq("user_id", userId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // ✅ ตรวจสอบว่ามี RESEND_API_KEY จริงไหม
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables");
      // บันทึก history แบบ demo
      await supabase.from("invoice_emails").insert({
        invoice_id: invoiceId,
        user_id: userId,
        sent_to: email,
        sent_at: new Date().toISOString(),
        is_demo: true,
        error: "RESEND_API_KEY not configured",
      });

      return NextResponse.json({
        success: false,
        message: "Email service not configured",
        error: "RESEND_API_KEY missing",
      }, { status: 500 });
    }

    // ✅ ส่งอีเมลจริงด้วย Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Crystal Labs <onboarding@resend.dev>",  // ✅ ใช้ได้เลย!
      to: email,
      subject: `Invoice #${invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #06b6d4; }
            .invoice-number { font-size: 18px; margin-top: 10px; }
            .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .label { color: #666; font-size: 14px; }
            .value { font-weight: bold; font-size: 16px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CRYSTAL LABS</div>
            <div class="invoice-number">INVOICE #${invoice.invoice_number}</div>
          </div>
          
          <div class="section">
            <div class="label">Invoice Date:</div>
            <div class="value">${new Date(invoice.created_at).toLocaleDateString()}</div>
          </div>
          
          <div class="section">
            <div class="label">Plugin:</div>
            <div class="value">${invoice.plugins?.name || invoice.plugin_id}</div>
          </div>
          
          <div class="section">
            <div class="label">Amount Paid:</div>
            <div class="value">${invoice.amount_total} ${invoice.currency}</div>
          </div>
          
          <div class="section">
            <div class="label">Status:</div>
            <div class="value" style="color: #10b981;">PAID</div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://crystal-labolatories-zc28.vercel.app/profile/invoices/${invoiceId}" class="button">
              View Invoice Details
            </a>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>This is an automated email from Crystal Labs.</p>
            <p>If you have any questions, contact: support@crystal-labs.com</p>
          </div>
        </body>
        </html>
      `,
      text: `
        CRYSTAL LABS - INVOICE #${invoice.invoice_number}
        
        Invoice Date: ${new Date(invoice.created_at).toLocaleDateString()}
        Plugin: ${invoice.plugins?.name || invoice.plugin_id}
        Amount: ${invoice.amount_total} ${invoice.currency}
        Status: PAID
        
        View invoice details:
        https://crystal-labolatories-zc28.vercel.app/profile/invoices/${invoiceId}
        
        Thank you for your purchase!
        
        Crystal Labs Support
        support@crystal-labs.com
      `,
    });

    if (resendError) {
      console.error("Resend email error:", resendError);

      await supabase.from("invoice_emails").insert({
        invoice_id: invoiceId,
        user_id: userId,
        sent_to: email,
        sent_at: new Date().toISOString(),
        is_demo: false,
        error: resendError.message,
        success: false,
      });

      return NextResponse.json({
        success: false,
        message: "Failed to send email",
        error: resendError.message,
      }, { status: 500 });
    }

    // ✅ บันทึกว่าส่งสำเร็จ
    await supabase.from("invoice_emails").insert({
      invoice_id: invoiceId,
      user_id: userId,
      sent_to: email,
      sent_at: new Date().toISOString(),
      is_demo: false,
      success: true,
      resend_id: emailResult?.id,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      invoiceId,
      sentTo: email,
      invoiceNumber: invoice.invoice_number,
      resendId: emailResult?.id,
    });

  } catch (error: any) {
    console.error("Send invoice email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}