import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ถ้า Stripe Secret Key ยังไม่มี ให้ return ข้อมูล mock แทน
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log("STRIPE_SECRET_KEY not configured yet");
    return NextResponse.json({ 
      status: "succeeded",
      message: "Mock payment status - Stripe not configured"
    });
  }

  // ใช้งาน Stripe จริงเมื่อมี environment variable
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-08-26.dahlia",
  });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing payment intent id" }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    return NextResponse.json({ status: paymentIntent.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve payment intent" }, { status: 500 });
  }
}