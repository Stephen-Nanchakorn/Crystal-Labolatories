import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// สร้าง Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

// สร้าง Supabase Service Role client เพื่อให้ข้าม RLS ในการสร้างสิทธิ์หลังบ้าน
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // 1. ตรวจสอบ Signature เพื่อความปลอดภัย (Webhook Signature Verification)
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. ดักจับ Event ชำระเงินสำเร็จ
  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    let userId: string | null = null;
    let paymentIntentId: string | null = null;
    let items: Array<{ plugin_slug: string; plugin_name: string }> = [];
    let invoiceId: string | null = null;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      userId = session.client_reference_id || session.metadata?.user_id || null;
      paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

      // ดึงรายการจาก metadata หรือ expand line items
      if (session.metadata?.items) {
        try {
          items = JSON.parse(session.metadata.items);
        } catch (_) {}
      }
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      userId = paymentIntent.metadata?.user_id || null;
      paymentIntentId = paymentIntent.id;

      if (paymentIntent.metadata?.items) {
        try {
          items = JSON.parse(paymentIntent.metadata.items);
        } catch (_) {}
      }
    }

    // 3. ป้องกันการทำงานซ้ำ (Idempotency) และค้นหาข้อมูลจากตาราง invoices
    if (paymentIntentId) {
      const { data: invoiceData } = await supabaseAdmin
        .from("invoices")
        .select("id, user_id, items, status")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .single();

      if (invoiceData) {
        invoiceId = invoiceData.id;
        if (!userId) userId = invoiceData.user_id;

        // อัปเดตสถานะบิลเป็น paid
        if (invoiceData.status !== "paid") {
          await supabaseAdmin
            .from("invoices")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("id", invoiceData.id);
        }

        // ดึงรายการไอเทมปลั๊กอินจาก invoice ถ้า metadata ไม่มี
        if (items.length === 0 && invoiceData.items) {
          items = typeof invoiceData.items === "string"
            ? JSON.parse(invoiceData.items)
            : invoiceData.items;
        }
      }
    }

    // 4. สร้าง License Key และบันทึกลงตาราง licenses
    if (userId && items.length > 0) {
      for (const item of items) {
        const pluginSlug = item.plugin_slug || (item as any).slug;
        const pluginName = item.plugin_name || (item as any).name || pluginSlug;

        if (!pluginSlug) continue;

        // ตรวจสอบว่าเคยออก License ให้กับออเดอร์นี้หรือยัง ป้องกัน duplicate
        const { data: existingLicense } = await supabaseAdmin
          .from("licenses")
          .select("id")
          .eq("user_id", userId)
          .eq("plugin_id", pluginSlug)
          .eq("invoice_id", invoiceId)
          .maybeSingle();

        if (!existingLicense) {
          const { error: insertLicenseError } = await supabaseAdmin
            .from("licenses")
            .insert({
              user_id: userId,
              plugin_id: pluginSlug,
              plugin_name: pluginName,
              max_seats: 2,
              status: "active",
              invoice_id: invoiceId,
            });

          if (insertLicenseError) {
            console.error("Error creating license:", insertLicenseError);
          } else {
            console.log(`Successfully generated license for user: ${userId}, plugin: ${pluginSlug}`);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}