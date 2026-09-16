import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

// ✅ ใช้ API Version 2026-08-26.dahlia ตามที่กำหนด
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia", // ✅ ใช้ version นี้ตามที่กำหนด
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session, supabase);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePayment(invoice, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleSuccessfulPayment(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  const userId = session.metadata?.userId;
  const referralCode = session.metadata?.referralCode;
  const amount = session.amount_total ? session.amount_total / 100 : 0;

  // ✅ Type assertion สำหรับ payment_intent (มันมีแน่ๆ ใน Checkout Session)
  const paymentIntentId = session.payment_intent as string;
  const invoiceId = session.invoice as string | undefined;

  // ถ้ามี referral code ให้ประมวลผล
  if (referralCode && userId && amount > 0) {
    // 1. หา referrer จาก referral code
    const { data: referralLink } = await supabase
      .from("referral_links")
      .select("user_id")
      .eq("code", referralCode)
      .single();

    if (referralLink) {
      const referrerId = referralLink.user_id;
      const commission = amount * 0.1; // 10%

      // 2. บันทึก referral conversion
      await supabase.from("referral_conversions").insert({
        referrer_id: referrerId,
        referred_user_id: userId,
        referral_code: referralCode,
        purchase_amount: amount,
        commission_earned: commission,
        status: "approved",
        stripe_payment_intent_id: paymentIntentId,
        stripe_invoice_id: invoiceId,
      });

      // 3. เพิ่ม credit ให้ referrer
      await supabase.from("user_credits").insert({
        user_id: referrerId,
        amount: commission,
        type: "referral",
        description: `Referral commission from user ${userId?.substring(0, 8) || 'unknown'}`,
        reference_id: session.id,
      });

      // 4. อัพเดต referral link stats
      try {
        await supabase.rpc("update_referral_stats", {
          p_referral_code: referralCode,
          p_earned_amount: commission,
        });
      } catch (rpcError) {
        console.error("RPC update_referral_stats failed:", rpcError);
        // Fallback
        await supabase
          .from("referral_links")
          .update({
            conversions: referralLink.conversions + 1,
            total_earned: (referralLink.total_earned || 0) + commission,
          })
          .eq("code", referralCode);
      }

      // 5. อัพเดต balance ใน users table
      await supabase
        .from("users")
        .update({
          balance: (referralLink.balance || 0) + commission,
          total_referral_credits: (referralLink.total_referral_credits || 0) + commission,
          referral_count: (referralLink.referral_count || 0) + 1,
        })
        .eq("id", referrerId);
    }
    // ในฟังก์ชัน handleSuccessfulPayment - เพิ่มส่วนนี้:

    // ถ้ามี referral code
    if (referralCode && referralLink) {
      const referrerId = referralLink.user_id;
      const commission = amount * 0.1; // 10%

      // 1. เพิ่ม credit ให้ referrer
      const { error: creditError } = await supabase
        .from("credit_transactions")
        .insert({
          user_id: referrerId,
          transaction_type: "earn",
          amount: commission,
          description: `Referral commission from ${session.metadata?.userId?.substring(0, 8) || 'user'}`,
          reference_type: "referral",
          reference_id: session.id,
          status: "completed"
        });

      if (creditError) {
        console.error("Error adding credit transaction:", creditError);
      }

      // 2. อัพเดต balance ใน users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          balance: (referralLink.balance || 0) + commission,
          credit_total: (referralLink.credit_total || 0) + commission
        })
        .eq("id", referrerId);

      if (updateError) {
        console.error("Error updating user balance:", updateError);
      }

      // 3. บันทึก referral conversion (ถ้ายังไม่มี)
      const { error: conversionError } = await supabase
        .from("referral_conversions")
        .insert({
          referrer_id: referrerId,
          referred_user_id: userId,
          referral_code: referralCode,
          purchase_amount: amount,
          commission_earned: commission,
          status: "approved",
          stripe_payment_intent_id: paymentIntentId
        });

      if (conversionError) {
        console.error("Error recording referral conversion:", conversionError);
      }

      console.log(`Added ${commission} credits to referrer ${referrerId}`);
    }
  }

  // 6. สร้าง invoice record
  if (userId && paymentIntentId) {
    await supabase.from("invoices").insert({
      user_id: userId,
      stripe_invoice_id: invoiceId,
      stripe_payment_intent_id: paymentIntentId,
      amount: amount,
      currency: session.currency || 'usd',
      items: session.metadata?.items
        ? JSON.parse(session.metadata.items)
        : [{ name: "Unknown Product", price: amount }],
      status: "paid",
      created_at: new Date().toISOString(),
    }).select();
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice, supabase: any) {
  // ✅ แก้ตรงนี้: ใน Invoice ของ Stripe version 2026, payment_intent อยู่ใน charge
  // invoice.charge คือ PaymentIntent object
  const charge = invoice.charge as Stripe.Charge | string | null;

  let paymentIntentId: string | null = null;

  if (typeof charge === 'string') {
    paymentIntentId = charge;
  } else if (charge && typeof charge === 'object' && 'payment_intent' in charge) {
    // ✅ ใน Stripe v2026, charge object มี payment_intent property
    paymentIntentId = (charge as any).payment_intent as string;
  }

  const customerId = invoice.customer as string;
  const amount = invoice.amount_paid / 100;

  // ดึง user id จาก customer
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (user && paymentIntentId) {
    // บันทึก invoice สำหรับ subscription
    await supabase.from("invoices").insert({
      user_id: user.id,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: paymentIntentId,
      amount: amount,
      currency: invoice.currency,
      items: [{
        name: "Crystal Creator Bundle Subscription",
        price: amount,
        period: invoice.metadata?.period || "monthly"
      }],
      status: "paid",
      created_at: new Date().toISOString(),
    }).select();
  }
}

// ✅ ตรวจสอบว่า webhook ทำงานได้
export async function GET() {
  return NextResponse.json({
    status: "Stripe webhook endpoint is running",
    timestamp: new Date().toISOString()
  });
}