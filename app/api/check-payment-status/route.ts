import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: Request) {
  // สร้าง Instance เฉพาะเมื่อมีการเรียกใช้งานจริง
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-08-26.dahlia", // ใช้ version มาตรฐานที่รองรับ
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