import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-08-26.dahlia" as any,
  });

  try {

    const body = await request.json();

    const {

      amount,

      currency = "thb",

      planName,

      customerEmail,

      items, // อาร์เรย์ปลั๊กอิน (ถ้ามี) เช่น [{ plugin_slug: 'stem-splitter', plugin_name: 'Stem Splitter' }]

      userId: bodyUserId, // user_id ที่อาจส่งมาจากหน้าบ้าน

    } = body;


    if (!amount) {

      return NextResponse.json({ error: "Amount is required" }, { status: 400 });

    }


    // 1. ตรวจสอบยืนยันตัวตน User จาก Header หรือ Body

    let userId = bodyUserId || null;

    const authHeader = request.headers.get("authorization");

    

    if (!userId && authHeader) {

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


    // 2. จัดรูปแบบรายการสินค้า (items) เพื่อส่งต่อให้ Webhook

    let formattedItems: Array<{ plugin_slug: string; plugin_name: string }> = [];

    if (items && Array.isArray(items)) {

      formattedItems = items.map((item: any) => ({

        plugin_slug: item.slug || item.plugin_slug || item.id,

        plugin_name: item.name || item.plugin_name || item.title || item.slug,

      }));

    } else if (planName) {

      // กรณีซื้อผ่าน planName (เช่น stem-splitter)

      formattedItems = [

        {

          plugin_slug: planName.toLowerCase().replace(/\s+/g, "-"),

          plugin_name: planName,

        },

      ];

    }


    // 3. กำหนด Payment Methods (PromptPay สำหรับ THB, Card เป็นค่ามาตรฐานสากล)

    const paymentMethodTypes = currency.toLowerCase() === "thb" 

      ? ["promptpay", "card"] 

      : ["card"];


    // 4. สร้าง Payment Intent พร้อม metadata ที่สมบูรณ์

    const paymentIntent = await stripe.paymentIntents.create({

      amount: Math.round(amount), // หน่วยสตางค์หรือ cent

      currency: currency.toLowerCase(),

      payment_method_types: paymentMethodTypes,

      metadata: {

        user_id: userId || "",

        email: customerEmail || "",

        plan: planName || "",

        items: JSON.stringify(formattedItems), // Webhook จะใช้ฟิลด์นี้สร้าง License Key

      },

    });


    return NextResponse.json({

      clientSecret: paymentIntent.client_secret,

      paymentIntentId: paymentIntent.id,

    });

  } catch (error: any) {

    console.error("Stripe payment intent error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });

  }

}