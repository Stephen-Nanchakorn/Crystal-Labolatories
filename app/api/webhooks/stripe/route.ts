import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // ✅ ต้องใช้ webhook secret จาก env
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // ✅ ตาม Stripe doc: ให้ return 200 ทันทีหลัง verify แล้วค่อย process async
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // ⚡ Process async เพื่อไม่ให้ stripe retry
      processCheckoutSession(session).catch(console.error);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ แยก async processing ออกมา
async function processCheckoutSession(session: any) {
  console.log("Payment succeeded:", {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
  });

  // 📝 ตรงนี้สามารถเพิ่ม logic บันทึกลง database ได้
  // เช่น: update order status, send confirmation email, etc.
}