import { createClient } from "@supabase/supabase-js";
import { getPluginName } from "@/lib/plugin-prices";

// ✅ Service Role Client — bypass RLS สำหรับเขียนข้อมูลแทน user (ใช้ใน server เท่านั้น)
function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ ต้องเพิ่ม env ตัวนี้ (server-only, ห้ามมี NEXT_PUBLIC_)
  );
}

// บรรทัด ~15: แก้จาก hardcoded เป็นใช้ env (กับ default 0.10)
const REFERRAL_COMMISSION_RATE = process.env.REFERRAL_COMMISSION_RATE
  ? parseFloat(process.env.REFERRAL_COMMISSION_RATE)
  : 0.10; // ✅ 10% default


interface RecordPurchaseParams {
  userId: string;
  pluginId: string;
  currency: "THB" | "USD";
  amountTotal: number;
  paymentIntentId: string | null;
  billingEmail: string | null;
  isFree?: boolean;
}

export async function recordPaidPurchase(params: RecordPurchaseParams) {
  const supabase = getServiceSupabase();
  const { userId, pluginId, currency, amountTotal, paymentIntentId, billingEmail, isFree } = params;

  // ✅ กันบันทึกซ้ำ (idempotency) — สำคัญเพราะ Webhook อาจยิงซ้ำได้ตามธรรมชาติของ Stripe
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from("invoices")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existing) return { invoiceId: existing.id, alreadyExists: true };
  } else if (isFree) {
    const { data: existingFree } = await supabase
      .from("invoice_items")
      .select("invoice_id, invoices!inner(user_id, status)")
      .eq("plugin_slug", pluginId)
      .eq("invoices.user_id", userId)
      .eq("invoices.status", "paid")
      .maybeSingle();
    if (existingFree) return { invoiceId: existingFree.invoice_id, alreadyExists: true };
  }

  const pluginName = getPluginName(pluginId);
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // 1. สร้าง invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: userId,
      invoice_number: invoiceNumber,
      status: "paid",
      items: [{ plugin_slug: pluginId, plugin_name: pluginName, quantity: 1, unit_price: amountTotal }],
      subtotal: amountTotal,
      tax_amount: 0,
      discount_amount: 0,
      credit_used: 0,
      total_amount: amountTotal,
      currency,
      payment_method: isFree ? "free" : "stripe",
      stripe_payment_intent_id: paymentIntentId,
      billing_email: billingEmail,
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (invoiceError || !invoice) {
    console.error("Error creating invoice:", invoiceError);
    throw new Error("Failed to create invoice");
  }

  // 2. สร้าง invoice_items
  await supabase.from("invoice_items").insert({
    invoice_id: invoice.id,
    plugin_slug: pluginId,
    plugin_name: pluginName,
    description: "Lifetime license with free updates",
    unit_price: amountTotal,
    quantity: 1,
    discount_percent: 0,
    total_price: amountTotal,
  });

  // 3. สร้าง invoice_payments (ข้ามถ้าฟรี)
  if (!isFree) {
    await supabase.from("invoice_payments").insert({
      invoice_id: invoice.id,
      payment_method: "card",
      amount: amountTotal,
      currency,
      status: "succeeded",
      stripe_payment_intent_id: paymentIntentId,
      payment_date: new Date().toISOString(),
    });

    // 4. ค่าคอมมิชชั่นแนะนำเพื่อน (ถ้ามี)
    await handleReferralCommission(supabase, userId, pluginId, amountTotal, paymentIntentId);
  }

  return { invoiceId: invoice.id, alreadyExists: false };
}

async function handleReferralCommission(
  supabase: ReturnType<typeof getServiceSupabase>,
  buyerId: string,
  pluginId: string,
  amount: number,
  paymentIntentId: string | null
) {
  const { data: buyer } = await supabase.from("users").select("referred_by").eq("id", buyerId).single();
  if (!buyer?.referred_by) return;

  const referrerId = buyer.referred_by;
  const commissionEarned = amount * REFERRAL_COMMISSION_RATE;

  await supabase.from("referral_conversions").insert({
    referrer_id: referrerId,
    referred_user_id: buyerId,
    purchase_amount: amount,
    commission_rate: REFERRAL_COMMISSION_RATE,
    commission_earned: commissionEarned,
    status: "completed",
    stripe_payment_intent_id: paymentIntentId,
  });

  const { data: referrer } = await supabase
    .from("users")
    .select("balance, total_referral_credits")
    .eq("id", referrerId)
    .single();

  if (referrer) {
    await supabase
      .from("users")
      .update({
        balance: (referrer.balance || 0) + commissionEarned,
        total_referral_credits: (referrer.total_referral_credits || 0) + commissionEarned,
      })
      .eq("id", referrerId);
  }

  await supabase.from("credit_transactions").insert({
    user_id: referrerId,
    transaction_type: "referral_commission",
    amount: commissionEarned,
    description: `ค่าคอมมิชชั่นจากการแนะนำซื้อ ${pluginId}`,
    reference_type: "referral_conversion",
    status: "completed",
  });
}