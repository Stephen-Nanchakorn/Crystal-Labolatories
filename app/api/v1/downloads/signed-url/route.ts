import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase Admin Client โดยใช้ Service Role Key เพื่อเข้าถึง Private Bucket และ Bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    // 1. ตรวจสอบ Authorization Token จาก Header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authorization token" },
        { status: 401 }
      );
    }

    // 2. ตรวจสอบความถูกต้องของ User จาก Token
    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired session token" },
        { status: 401 }
      );
    }

    // 3. รับค่าและ Validate พารามิเตอร์ Body
    const body = await req.json();
    const { plugin_id, platform } = body;

    if (!plugin_id || !platform) {
      return NextResponse.json(
        { error: "Bad Request: plugin_id and platform are required" },
        { status: 400 }
      );
    }

    const targetPlatform = platform.toLowerCase();
    if (!["mac", "win"].includes(targetPlatform)) {
      return NextResponse.json(
        { error: "Invalid platform: Supported platforms are 'mac' or 'win'" },
        { status: 400 }
      );
    }

    // 4. ตรวจสอบสิทธิ์การใช้งาน (Entitlement Check)
    // สำหรับปลั๊กอินฟรี (เช่น drop-tune) อนุญาตให้ดาวน์โหลดได้ทันที
    const freePlugins = ["drop-tune"];
    const isFree = freePlugins.includes(plugin_id);

    if (!isFree) {
      const { data: license, error: licenseError } = await supabaseAdmin
        .from("licenses")
        .select("id, status, is_trial, expires_at")
        .eq("user_id", user.id)
        .eq("plugin_id", plugin_id)
        .eq("status", "active")
        .maybeSingle();

      if (licenseError) {
        return NextResponse.json(
          { error: "Database error checking license: " + licenseError.message },
          { status: 500 }
        );
      }

      if (!license) {
        return NextResponse.json(
          {
            error: "Forbidden: You do not own an active license for this plugin.",
          },
          { status: 403 }
        );
      }

      // ตรวจสอบวันหมดอายุ (กรณีเป็น Trial License)
      if (license.is_trial && license.expires_at) {
        const isExpired = new Date(license.expires_at) < new Date();
        if (isExpired) {
          return NextResponse.json(
            { error: "Forbidden: Your trial license for this plugin has expired." },
            { status: 403 }
          );
        }
      }
    }

    // 5. ค้นหาไฟล์ติดตั้งเวอร์ชันล่าสุดจากตาราง plugin_versions
    const { data: versionData, error: versionError } = await supabaseAdmin
      .from("plugin_versions")
      .select("installer_path, version, sha256_checksum, file_size_bytes")
      .eq("plugin_id", plugin_id)
      .in("platform", [targetPlatform, "universal"])
      .eq("is_latest", true)
      .order("release_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (versionError) {
      return NextResponse.json(
        { error: "Database error querying version: " + versionError.message },
        { status: 500 }
      );
    }

    // กำหนด Path เริ่มต้นหากยังไม่ได้ลงทะเบียนในตาราง plugin_versions
    let installerPath = `${plugin_id}/${plugin_id}-${targetPlatform}.zip`;
    if (versionData?.installer_path) {
      installerPath = versionData.installer_path;
    }

    // 6. สร้าง Signed URL จาก Supabase Storage (Private Bucket: plugin-installers)
    // กำหนดอายุลิงก์ 300 วินาที (5 นาที)
    const { data: signedUrlData, error: storageError } = await supabaseAdmin.storage
      .from("plugin-installers")
      .createSignedUrl(installerPath, 300);

    if (storageError || !signedUrlData?.signedUrl) {
      console.error("Storage error creating signed url:", storageError);
      return NextResponse.json(
        {
          error:
            "Installer file not found on storage or storage permission denied.",
        },
        { status: 404 }
      );
    }

    // 7. ตอบกลับ Payload พร้อม Metadata สำหรับแอป Central และหน้าเว็บ
    return NextResponse.json({
      success: true,
      plugin_id,
      platform: targetPlatform,
      version: versionData?.version || "1.0.0",
      download_url: signedUrlData.signedUrl,
      checksum_sha256: versionData?.sha256_checksum || null,
      file_size_bytes: versionData?.file_size_bytes || null,
      expires_in_seconds: 300,
    });
  } catch (err: any) {
    console.error("Signed URL generation failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}