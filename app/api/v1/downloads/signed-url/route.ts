import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client สำหรับตรวจสอบ User Token
const supabaseClient = (token: string) =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

// Supabase Admin สำหรับสร้าง Signed URL จาก Private Bucket
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const { plugin_id, platform = "mac" } = await req.json();

    if (!plugin_id) {
      return NextResponse.json(
        { error: "plugin_id is required" },
        { status: 400 }
      );
    }

    // 1. ตรวจสอบยืนยันตัวตนของผู้ใช้
    const supabase = supabaseClient(token);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. ปลั๊กอินฟรี (เช่น drop-tune) อนุญาตให้ดาวน์โหลดได้ทันที
    const isFreePlugin = plugin_id.toLowerCase() === "drop-tune";

    if (!isFreePlugin) {
      // 3. ตรวจสอบสิทธิ์ในตาราง licenses ว่าผู้ใช้ซื้อปลั๊กอินตัวนี้หรือยัง
      const { data: license, error: licenseError } = await supabaseAdmin
        .from("licenses")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("plugin_id", plugin_id)
        .eq("status", "active")
        .maybeSingle();

      if (licenseError || !license) {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: "You do not own an active license for this plugin.",
          },
          { status: 403 }
        );
      }
    }

    // 4. ค้นหาที่อยู่ไฟล์ล่าสุดจากตาราง plugin_versions หรือใช้ default path
    let filePath = `${plugin_id}/${plugin_id}-${platform}.zip`;

    const { data: versionData } = await supabaseAdmin
      .from("plugin_versions")
      .select("installer_path")
      .eq("plugin_id", plugin_id)
      .eq("platform", platform)
      .eq("is_latest", true)
      .maybeSingle();

    if (versionData?.installer_path) {
      filePath = versionData.installer_path;
    }

    // 5. สร้าง Signed URL มีอายุ 300 วินาที (5 นาที) จาก Private Storage
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from("plugin-installers")
      .createSignedUrl(filePath, 300); // 300 วินาที = 5 นาที

    if (storageError || !signedUrlData?.signedUrl) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        {
          error: "Installer not found",
          message: `The installer file for ${plugin_id} (${platform}) is not yet uploaded to storage.`,
        },
        { status: 404 }
      );
    }

    // 6. ส่ง Signed URL กลับไปให้ Client / แอป Central
    return NextResponse.json({
      success: true,
      plugin_id,
      platform,
      download_url: signedUrlData.signedUrl,
      expires_in_seconds: 300,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}