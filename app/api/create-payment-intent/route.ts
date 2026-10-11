import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getPriceInCents, getPluginName, isPluginFree } from "@/lib/plugin-prices";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-08-26.dahlia" as any,
  });

  try {
    const body = await request.json();
    const {
      currency = "thb",
      planName,
      customerEmail,
      items,
      userId: bodyUserId,
    } = body;

    const normalizedCurrency = (currency.toUpperCase() === "USD" ? "USD" : "THB") as "THB" | "USD";

    // 1. ตรวจสอบยืนยันตัวตน User จาก Token ก่อนเสมอเพื่อความปลอดภัย
    let userId = bodyUserId || null;
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    }

    // 2. จัดรูปแบบรายการสินค้า (items) และคำนวณราคาจริงบน Server (Server-side Price Calculation)
    let formattedItems: Array<{ plugin_slug: string; plugin_name: string }> = [];
    let serverCalculatedAmountInCents = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      formattedItems = items.map((item: any) => {
        const slug = item.slug || item.plugin_slug || item.id;
        const name = item.name || item.plugin_name || item.title || getPluginName(slug);
        return { plugin_slug: slug, plugin_name: name };
      });

      for (const it of formattedItems) {
        if (!isPluginFree(it.plugin_slug)) {
          const itemPrice = getPriceInCents(it.plugin_slug, normalizedCurrency);
          serverCalculatedAmountInCents += itemPrice;
        }
      }
    } else if (planName) {
      const slug = planName.toLowerCase().replace(/\s+/g, "-");
      formattedItems = [
        {
          plugin_slug: slug,
          plugin_name: getPluginName(slug) !== "Unknown Plugin" ? getPluginName(slug) : planName,
        },
      ];
      if (!isPluginFree(slug)) {
        serverCalculatedAmountInCents = getPriceInCents(slug, normalizedCurrency);
      }
    }

    // ป้องกันการแฮกราคาหรือสั่งซื้อรายการฟรีผ่าน Payment Intent
    if (serverCalculatedAmountInCents <= 0) {
      return NextResponse.json(
        { error: "Invalid purchase: Total payable amount must be greater than zero. For free plugins, please use claim-free." },
        { status: 400 }
      );
    }

    // 3. กำหนด Payment Methods (PromptPay สำหรับ THB, Card สำหรับสากล)
    const paymentMethodTypes = normalizedCurrency === "THB"
      ? ["promptpay", "card"]
      : ["card"];

    // 4. สร้าง Payment Intent ด้วยยอดเงินที่คำนวณจาก Server เท่านั้น (ป้องกัน Arbitrary Amount Manipulation)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: serverCalculatedAmountInCents,
      currency: normalizedCurrency.toLowerCase(),
      payment_method_types: paymentMethodTypes,
      metadata: {
        user_id: userId || "",
        email: customerEmail || "",
        plan: planName || "",
        items: JSON.stringify(formattedItems),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: serverCalculatedAmountInCents,
      currency: normalizedCurrency,
    });
  } catch (error: any) {
    console.error("Stripe payment intent error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
