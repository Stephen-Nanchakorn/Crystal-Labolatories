import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordPaidPurchase } from "@/lib/purchase";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pluginId } = await request.json();
    
    // ✅ ใช้ฟังก์ชันจาก plugin-prices แทน hardcode
    const isFreePlugin = pluginId === "drop-tune";
    if (!isFreePlugin) {
      return NextResponse.json({ error: "This plugin is not free" }, { status: 400 });
    }

    const result = await recordPaidPurchase({
      userId: user.id,
      pluginId,
      currency: "THB",
      amountTotal: 0,
      paymentIntentId: null,
      billingEmail: user.email || null,
      isFree: true,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Claim free plugin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}