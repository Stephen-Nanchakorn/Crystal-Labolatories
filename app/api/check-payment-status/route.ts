import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ SOLUTION: ไม่ให้ Stripe initialize ถ้าไม่มี key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is not configured in Vercel");
    return NextResponse.json({
      status: "mock_succeeded",
      message: "Payment system not configured - demo mode"
    });
  }

  // ✅ ใช้ dynamic import ป้องกัน build-time error
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-08-26.dahlia", // ใช้ version เดียวกับไฟล์อื่น
  });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      error: "Missing payment intent id"
    }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    return NextResponse.json({ status: paymentIntent.status });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to retrieve payment intent"
    }, { status: 500 });
  }
}