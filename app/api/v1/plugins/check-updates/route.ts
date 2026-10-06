import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ฟังก์ชันเปรียบเทียบ Semantic Versioning (เช่น 1.0.1 กับ 1.1.0)
function isNewerVersion(latest: string, current: string): boolean {
  const parse = (v: string) => v.replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
  const [lMajor, lMinor, lPatch] = parse(latest);
  const [cMajor, cMinor, cPatch] = parse(current);

  if (lMajor !== cMajor) return lMajor > cMajor;
  if (lMinor !== cMinor) return lMinor > cMinor;
  return lPatch > cPatch;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pluginId = searchParams.get("plugin_id");
    const currentVersion = searchParams.get("current_version") || "0.0.0";
    const platform = (searchParams.get("platform") || "mac").toLowerCase();

    if (!pluginId) {
      return NextResponse.json(
        { error: "plugin_id is required" },
        { status: 400 }
      );
    }

    // 1. ค้นหาเวอร์ชันล่าสุดของปลั๊กอินตัวนั้นตามแพลตฟอร์ม
    const { data: latestRelease, error } = await supabase
      .from("plugin_versions")
      .select("version, platform, changelog, min_os_version, release_date")
      .eq("plugin_id", pluginId)
      .in("platform", [platform, "universal"])
      .eq("is_latest", true)
      .order("release_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ถ้ายังไม่มีข้อมูลเวอร์ชันในตาราง
    if (!latestRelease) {
      return NextResponse.json({
        plugin_id: pluginId,
        has_update: false,
        message: "No release versions registered for this plugin yet.",
      });
    }

    // 2. เปรียบเทียบเลขเวอร์ชัน
    const updateAvailable = isNewerVersion(latestRelease.version, currentVersion);

    return NextResponse.json({
      success: true,
      plugin_id: pluginId,
      current_version: currentVersion,
      latest_version: latestRelease.version,
      has_update: updateAvailable,
      platform: latestRelease.platform,
      changelog: updateAvailable ? latestRelease.changelog : null,
      min_os_version: latestRelease.min_os_version,
      release_date: latestRelease.release_date,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}