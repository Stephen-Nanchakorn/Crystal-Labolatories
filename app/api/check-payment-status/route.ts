import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing payment intent id" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(id);
  return NextResponse.json({ status: paymentIntent.status });
}