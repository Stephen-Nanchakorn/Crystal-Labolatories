"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ แก้: downloadInvoice ไม่ยิงไปหา API ที่ไม่มีจริงอีกต่อไป
// แต่ส่งสัญญาณให้หน้าเว็บพาไปหน้า client-side ที่สร้าง PDF เอง (ที่แก้ไว้แล้วก่อนหน้านี้)
// ✅ ฟังก์ชัน downloadInvoice แบบใหม่
export async function downloadInvoice(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { 
      success: false, 
      error: "กรุณาล็อกอินก่อน",
      url: null,
      fileName: null,
      useDirectUrl: false,
      redirectPath: null
    };
  }

  try {
    const { data: invoice } = await supabase
      .from("invoices")
      .select("invoice_number, stripe_receipt_url")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (!invoice) {
      return { 
        success: false, 
        error: "ไม่พบใบเสร็จ",
        url: null,
        fileName: null,
        useDirectUrl: false,
        redirectPath: null
      };
    }

    // ถ้ามีใบเสร็จจาก Stripe จริง ใช้อันนั้นเลย
    if (invoice.stripe_receipt_url) {
      return {
        success: true,
        error: null,
        useDirectUrl: true,
        url: invoice.stripe_receipt_url,
        fileName: `invoice-${invoice.invoice_number}.pdf`,
        redirectPath: null
      };
    }

    // ถ้าไม่มี ให้บอกหน้าเว็บพาไปสร้าง PDF ฝั่ง client แทน
    return {
      success: true,
      error: null,
      useDirectUrl: false,
      url: null,
      fileName: `invoice-${invoice.invoice_number}.pdf`,
      redirectPath: `/profile/invoices/${invoiceId}/download`
    };
  } catch (error: any) {
    console.error("Error downloading invoice:", error);
    return { 
      success: false, 
      error: "ไม่สามารถดาวน์โหลดใบเสร็จได้",
      url: null,
      fileName: null,
      useDirectUrl: false,
      redirectPath: null
    };
  }
}

// ✅ แก้: sendInvoiceByEmail ให้ส่งอีเมลจริงผ่าน Resend
export async function sendInvoiceByEmail(invoiceId: string, email?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    const { data: invoice } = await supabase
      .from("invoices")
      .select("invoice_number, billing_email, total_amount, currency, status, created_at, items")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (!invoice) {
      return { error: "ไม่พบใบเสร็จ" };
    }

    const recipientEmail = email || invoice.billing_email || user.email;

    if (!recipientEmail) {
      return { error: "ไม่พบอีเมลผู้รับ" };
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set");
      return { error: "ระบบอีเมลยังไม่ได้ตั้งค่า" };
    }

    // ✅ ส่งอีเมลจริง
    const { data: emailResult, error: resendError } = await resend.emails.send({
      from: "Crystal Labs <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Invoice #${invoice.invoice_number} - Crystal Labs`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">CRYSTAL LABS</h2>
          <h3>Invoice #${invoice.invoice_number}</h3>
          <p>Date: ${new Date(invoice.created_at).toLocaleDateString()}</p>
          <p>Amount: ${invoice.total_amount} ${invoice.currency}</p>
          <p>Status: ${invoice.status}</p>
          <p style="margin-top: 30px;">
            <a href="https://crystal-labolatories-zc28.vercel.app/profile/invoices/${invoiceId}"
               style="background:#06b6d4;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
              View Invoice
            </a>
          </p>
        </div>
      `,
    });

    if (resendError) {
      console.error("❌ Resend error:", resendError);
      return { error: `ส่งอีเมลไม่สำเร็จ: ${resendError.message}` };
    }

    console.log("✅ Email sent:", emailResult?.id);

    return {
      success: true,
      message: `ส่งใบเสร็จ ${invoice.invoice_number} ไปที่ ${recipientEmail} เรียบร้อยแล้ว`,
      email: recipientEmail,
    };
  } catch (error: any) {
    console.error("Error sending invoice email:", error);
    return { error: "ไม่สามารถส่งอีเมลได้" };
  }
}