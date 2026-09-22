import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { recordPaidPurchase } from "@/lib/purchase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, status: session.payment_status });
    }

    const userId = session.metadata?.userId;
    const pluginId = session.metadata?.pluginId;
    const currency = (session.metadata?.currency as "THB" | "USD") || "THB";

    if (!userId || !pluginId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;

    const result = await recordPaidPurchase({
      userId,
      pluginId,
      currency,
      amountTotal,
      paymentIntentId,
      billingEmail: session.customer_email,
    });

    return NextResponse.json({ success: true, pluginId, invoiceId: result.invoiceId });
  } catch (error: any) {
    console.error("Verify session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}