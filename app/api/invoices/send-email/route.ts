import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
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

    // ✅ ตรวจสอบ Resend API Key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // ✅ ส่งอีเมลจริง
    const { data: emailResult, error: resendError } = await resend.emails.send({
     from: process.env.RESEND_FROM_EMAIL || "Crystal Labs <onboarding@resend.dev>",
      to: email,
      subject: `Invoice #${invoice.invoice_number} - Crystal Labs`, // ✅ เปลี่ยนจาก invoiceNumber เป็น invoice.invoice_number
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
            <p>If you have any questions, contact: ${process.env.SUPPORT_EMAIL || "support@crystal-labs.com"}</p>
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
${process.env.SUPPORT_EMAIL || "support@crystal-labs.com"}
      `,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      throw new Error(`Email sending failed: ${resendError.message}`);
    }

    // บันทึก history
    await supabase.from("invoice_emails").insert({
      invoice_id: invoiceId,
      user_id: userId,
      sent_to: email,
      sent_at: new Date().toISOString(),
      resend_id: emailResult?.id,
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      invoiceId,
      sentTo: email,
      resendId: emailResult?.id,
    });

  } catch (error: any) {
    console.error("Send email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}