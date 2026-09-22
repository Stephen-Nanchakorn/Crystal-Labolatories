import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { recordPaidPurchase } from "@/lib/purchase";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe signature or webhook secret");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const pluginId = session.metadata?.pluginId;
      const currency = (session.metadata?.currency as "THB" | "USD") || "THB";

      if (!userId || !pluginId) {
        console.error("Missing metadata in checkout session:", session.id);
        return NextResponse.json({ received: true, warning: "Missing metadata" });
      }

      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;

      await recordPaidPurchase({
        userId,
        pluginId,
        currency,
        amountTotal,
        paymentIntentId,
        billingEmail: session.customer_email,
      });

      console.log(`Purchase recorded via webhook: user=${userId}, plugin=${pluginId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}