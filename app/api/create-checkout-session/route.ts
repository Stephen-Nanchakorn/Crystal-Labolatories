import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { pluginId, quantity, currency, successUrl, cancelUrl, userId, customerEmail } =
      await request.json();

    if (!pluginId || !currency || !successUrl || !cancelUrl || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const checkoutUrl = await createCheckoutSession(
      pluginId,
      quantity || 1,
      currency,
      successUrl,
      cancelUrl,
      userId,
      customerEmail
    );

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}