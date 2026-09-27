// app/api/debug-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Server-side keys
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
    
    // Client-side keys (ต้องไม่มีค่าใน server)
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    
    // เช็ค mode
    mode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "LIVE" : "TEST",
  });
}