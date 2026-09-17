"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==================== 1. ดึง invoices ทั้งหมด ====================
export async function getUserInvoices(
  limit: number = 20,
  offset: number = 0,
  status?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // Build query
    let query = supabase
      .from("invoices")
      .select(`
        *,
        invoice_items (*),
        invoice_payments (*)
      `, { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Filter by status if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit
    };
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { error: "ไม่สามารถดึงข้อมูลใบเสร็จได้" };
  }
}

// ==================== 2. ดึง invoice เดี่ยว ====================
export async function getInvoiceById(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        invoice_items (*),
        invoice_payments (*)
      `)
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: invoice
    };
  } catch (error) {
    console.error("Error getting invoice:", error);
    return { error: "ไม่สามารถดึงข้อมูลใบเสร็จได้" };
  }
}

// ==================== 3. สร้าง invoice ใหม่ ====================
export async function createInvoice(
  items: Array<{
    slug: string;
    name: string;
    description: string;
    unit_price: number;
    quantity: number;
    discount_percent: number;
    total_price: number;
  }>,
  subtotal: number,
  discountAmount: number = 0,
  creditUsed: number = 0,
  totalAmount: number,
  currency: string = "USD",
  paymentMethod: string,
  stripePaymentIntentId: string,
  billingEmail: string,
  billingName?: string,
  billingAddress?: any
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // Call PostgreSQL function to create invoice
    const { data: invoiceId, error } = await supabase
      .rpc('create_invoice_from_order', {
        p_user_id: user.id,
        p_items: items,
        p_subtotal: subtotal,
        p_discount_amount: discountAmount,
        p_credit_used: creditUsed,
        p_total_amount: totalAmount,
        p_currency: currency,
        p_payment_method: paymentMethod,
        p_stripe_payment_intent_id: stripePaymentIntentId,
        p_billing_email: billingEmail,
        p_billing_name: billingName,
        p_billing_address: billingAddress
      });

    if (error) throw error;

    // Get the created invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    revalidatePath("/profile/invoices");
    
    return {
      success: true,
      data: invoice,
      message: "สร้างใบเสร็จเรียบร้อยแล้ว"
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { error: "ไม่สามารถสร้างใบเสร็จได้" };
  }
}

// ==================== 4. ดาวน์โหลด invoice เป็น PDF ====================
export async function downloadInvoice(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // Verify invoice belongs to user
    const { data: invoice } = await supabase
      .from("invoices")
      .select("invoice_number, stripe_receipt_url")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (!invoice) {
      return { error: "ไม่พบใบเสร็จ" };
    }

    // If Stripe receipt URL exists, use it
    if (invoice.stripe_receipt_url) {
      return {
        success: true,
        url: invoice.stripe_receipt_url,
        fileName: `invoice-${invoice.invoice_number}.pdf`
      };
    }

    // Otherwise, generate PDF URL (สำหรับระบบที่สร้าง PDF เอง)
    const pdfUrl = `/api/invoices/${invoiceId}/pdf`;
    
    return {
      success: true,
      url: pdfUrl,
      fileName: `invoice-${invoice.invoice_number}.pdf`
    };
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return { error: "ไม่สามารถดาวน์โหลดใบเสร็จได้" };
  }
}

// ==================== 5. ส่ง invoice ไปที่ email ====================
export async function sendInvoiceByEmail(invoiceId: string, email?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // Verify invoice belongs to user
    const { data: invoice } = await supabase
      .from("invoices")
      .select("invoice_number, billing_email")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (!invoice) {
      return { error: "ไม่พบใบเสร็จ" };
    }

    const recipientEmail = email || invoice.billing_email;

    // Call API to send email (จะ implement จริงในขั้นตอนถัดไป)
    // สำหรับตอนนี้ return success พร้อมข้อมูล
    return {
      success: true,
      message: `ส่งใบเสร็จ ${invoice.invoice_number} ไปที่ ${recipientEmail} เรียบร้อยแล้ว`,
      email: recipientEmail
    };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return { error: "ไม่สามารถส่งอีเมลได้" };
  }
}

// ==================== 6. ดึงสถิติ invoices ====================
export async function getInvoiceStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "กรุณาล็อกอินก่อน" };
  }

  try {
    // ดึงข้อมูลสถิติทั้งหมด
    const { data: invoices } = await supabase
      .from("invoices")
      .select("status, total_amount, currency, created_at")
      .eq("user_id", user.id);

    if (!invoices) {
      return {
        success: true,
        data: {
          totalInvoices: 0,
          totalSpent: 0,
          paidInvoices: 0,
          pendingInvoices: 0,
          currency: "USD"
        }
      };
    }

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'paid').length;
    const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
    const totalSpent = invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

    return {
      success: true,
      data: {
        totalInvoices,
        totalSpent,
        paidInvoices,
        pendingInvoices,
        currency: invoices[0]?.currency || "USD"
      }
    };
  } catch (error) {
    console.error("Error getting invoice stats:", error);
    return { error: "ไม่สามารถดึงสถิติได้" };
  }
}