import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { license_key, hardware_uuid, activation_id } = await req.json();

    if (!activation_id && (!license_key || !hardware_uuid)) {
      return NextResponse.json(
        { error: "Provide either activation_id or (license_key + hardware_uuid)" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("license_activations").delete();

    if (activation_id) {
      query = query.eq("id", activation_id);
    } else {
      const { data: license } = await supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("license_key", license_key)
        .single();

      if (!license) {
        return NextResponse.json({ error: "Invalid license key" }, { status: 404 });
      }

      query = query.eq("license_id", license.id).eq("hardware_uuid", hardware_uuid);
    }

    const { error: deleteError } = await query;
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Machine deactivated successfully. Seat released.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}