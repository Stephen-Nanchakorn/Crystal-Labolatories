import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { license_key, hardware_uuid, machine_name, os } = await req.json();

    if (!license_key || !hardware_uuid) {
      return NextResponse.json(
        { error: "license_key and hardware_uuid are required" },
        { status: 400 }
      );
    }

    // 1. ค้นหา License
    const { data: license, error: licError } = await supabaseAdmin
      .from("licenses")
      .select("id, plugin_id, plugin_name, max_seats, status")
      .eq("license_key", license_key)
      .single();

    if (licError || !license) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 404 });
    }

    if (license.status !== "active") {
      return NextResponse.json({ error: `License is ${license.status}` }, { status: 403 });
    }

    // 2. เช็คว่าเครื่องนี้เปิดใช้งานไว้อยู่แล้วหรือไม่
    const { data: existingActivation } = await supabaseAdmin
      .from("license_activations")
      .select("id")
      .eq("license_id", license.id)
      .eq("hardware_uuid", hardware_uuid)
      .maybeSingle();

    if (existingActivation) {
      // อัปเดตเวลาเช็คล่าสุด
      await supabaseAdmin
        .from("license_activations")
        .update({ last_checked_at: new Date().toISOString() })
        .eq("id", existingActivation.id);

      return NextResponse.json({
        success: true,
        message: "Machine already activated",
        plugin_id: license.plugin_id,
      });
    }

    // 3. ตรวจสอบจำนวนเครื่อง (Seat Limit)
    const { count, error: countError } = await supabaseAdmin
      .from("license_activations")
      .select("*", { count: "exact", head: true })
      .eq("license_id", license.id);

    if ((count || 0) >= license.max_seats) {
      return NextResponse.json(
        {
          error: "Seat limit reached",
          message: `This license is already active on ${count} machines (Limit: ${license.max_seats}). Please deactivate an old machine first.`,
        },
        { status: 403 }
      );
    }

    // 4. บันทึกเครื่องใหม่
    const { error: insertError } = await supabaseAdmin
      .from("license_activations")
      .insert({
        license_id: license.id,
        hardware_uuid,
        machine_name: machine_name || "Unknown Computer",
        os: os || "macOS",
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "License successfully activated on this machine",
      plugin_id: license.plugin_id,
      plugin_name: license.plugin_name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}