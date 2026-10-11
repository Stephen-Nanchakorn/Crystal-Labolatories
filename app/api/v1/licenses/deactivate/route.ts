import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { license_key, hardware_uuid, activation_id } = await req.json();

    // 1. ตรวจสอบว่าผู้เรียกมีการแนบ User Token มาหรือไม่ (กรณีเรียกจาก Web Dashboard หรือ Central ที่ล็อกอินอยู่)
    let authenticatedUserId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const supabaseUser = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const { data: { user } } = await supabaseUser.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
      }
    }

    // 2. ป้องกัน Unauthorized Deactivation
    // กรณีที่ 1: ส่ง activation_id มา (มักมาจาก Web Dashboard) -> ต้องมี Token และต้องเป็นเจ้าของ License นั้นจริง
    if (activation_id) {
      if (!authenticatedUserId) {
        return NextResponse.json(
          { error: "Unauthorized: You must be logged in to deactivate by activation_id" },
          { status: 401 }
        );
      }

      // ตรวจสอบว่า activation_id นี้ผูกกับ license ที่เป็นของ authenticated user หรือไม่
      const { data: activation, error: actError } = await supabaseAdmin
        .from("license_activations")
        .select("id, license_id, licenses!inner(user_id)")
        .eq("id", activation_id)
        .maybeSingle();

      if (actError || !activation) {
        return NextResponse.json({ error: "Activation record not found" }, { status: 404 });
      }

      const ownerUserId = (activation as any).licenses?.user_id;
      if (ownerUserId !== authenticatedUserId) {
        return NextResponse.json(
          { error: "Forbidden: You do not own the license for this activation" },
          { status: 403 }
        );
      }

      const { error: deleteError } = await supabaseAdmin
        .from("license_activations")
        .delete()
        .eq("id", activation_id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Machine deactivated successfully. Seat released.",
      });
    }

    // กรณีที่ 2: ยกเลิกจากตัวเครื่องแอป (ต้องการ license_key และ hardware_uuid คู่กันเสมอ)
    if (!license_key || !hardware_uuid) {
      return NextResponse.json(
        { error: "Provide either activation_id (with auth token) or (license_key + hardware_uuid)" },
        { status: 400 }
      );
    }

    const { data: license } = await supabaseAdmin
      .from("licenses")
      .select("id, user_id")
      .eq("license_key", license_key.trim())
      .maybeSingle();

    if (!license) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 404 });
    }

    // ตรวจสอบและลบ activation ที่ตรงกับ hardware_uuid ของ license นี้เท่านั้น
    const { error: deleteError, count } = await supabaseAdmin
      .from("license_activations")
      .delete({ count: "exact" })
      .eq("license_id", license.id)
      .eq("hardware_uuid", hardware_uuid.trim());

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (count === 0) {
      return NextResponse.json(
        { error: "No active device found matching this hardware UUID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Machine deactivated successfully. Seat released.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
