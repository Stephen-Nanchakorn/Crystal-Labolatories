import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    // ตรวจสอบความถูกต้องของ Token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงรายการ licenses พร้อม activations ของ user รายนี้
    const { data: licenses, error: licenseError } = await supabase
      .from("licenses")
      .select(`
        id,
        plugin_id,
        plugin_name,
        license_key,
        max_seats,
        status,
        created_at,
        license_activations (
          id,
          hardware_uuid,
          machine_name,
          os,
          activated_at
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "active");

    if (licenseError) {
      return NextResponse.json({ error: licenseError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      total_plugins: licenses.length,
      licenses: licenses.map((lic) => ({
        id: lic.id,
        plugin_id: lic.plugin_id,
        plugin_name: lic.plugin_name,
        license_key: lic.license_key,
        max_seats: lic.max_seats,
        used_seats: lic.license_activations?.length || 0,
        activations: lic.license_activations || [],
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}