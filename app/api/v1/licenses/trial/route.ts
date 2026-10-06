import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. ยืนยันตัวตน User
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    const { plugin_id, plugin_name } = await req.json();

    if (!plugin_id) {
      return NextResponse.json({ error: "plugin_id is required" }, { status: 400 });
    }

    // 2. เช็คว่า User เคยขอ Trial หรือซื้อปลั๊กอินตัวนี้ไปแล้วหรือยัง (1 คนได้ 1 ครั้ง)
    const { data: existingLicense } = await supabaseAdmin
      .from("licenses")
      .select("id, is_trial, expires_at")
      .eq("user_id", user.id)
      .eq("plugin_id", plugin_id)
      .maybeSingle();

    if (existingLicense) {
      return NextResponse.json(
        {
          error: "Trial already claimed",
          message: "You have already started a trial or already own this plugin.",
        },
        { status: 400 }
      );
    }

    // 3. กำหนดวันหมดอายุ 14 วันนับจากวันนี้
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 14);

    // 4. บันทึก Trial License
    const { data: trialLicense, error: insertError } = await supabaseAdmin
      .from("licenses")
      .insert({
        user_id: user.id,
        plugin_id,
        plugin_name: plugin_name || plugin_id,
        is_trial: true,
        expires_at: expiry.toISOString(),
        max_seats: 1, // สิทธิ์ทดลองใช้งานให้ 1 เครื่อง
        status: "active",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "14-Day Free Trial activated successfully!",
      license: trialLicense,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}