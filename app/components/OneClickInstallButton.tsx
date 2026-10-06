"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface OneClickInstallProps {
  pluginSlug: string;
  pluginName: string;
}

export default function OneClickInstallButton({
  pluginSlug,
  pluginName,
}: OneClickInstallProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDeepLinkInstall = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("กรุณาเข้าสู่ระบบก่อนสั่งติดตั้ง");
      window.location.href = "/login";
      setLoading(false);
      return;
    }

    // 1. ประกอบ Custom Deep Link Protocol สำหรับ Crystal Access Desktop App
    const token = session.access_token;
    const deepLinkUrl = `crystalaccess://install?plugin=${encodeURIComponent(
      pluginSlug
    )}&token=${encodeURIComponent(token)}`;

    // 2. สั่งเปิด Protocol บนคอมพิวเตอร์ (macOS / Windows)
    window.location.href = deepLinkUrl;

    // 3. Fallback: หากผ่านไป 2.5 วินาทีแล้วไม่มีแอปตอบรับ แสดงว่าเครื่องยังไม่ได้ลงแอป Central
    const fallbackTimer = setTimeout(() => {
      if (!document.hidden) {
        if (
          confirm(
            "ไม่พบแอป Crystal Access บนเครื่องของคุณ ต้องการดาวน์โหลดตัวติดตั้งแอปก่อนหรือไม่?"
          )
        ) {
          window.location.href = "/downloads/crystal-access";
        }
      }
      setLoading(false);
    }, 2500);

    // ถ้าผู้ใช้สลับหน้าจอไปที่แอป Central แล้ว ให้ยกเลิก Timer
    window.addEventListener(
      "blur",
      () => {
        clearTimeout(fallbackTimer);
        setLoading(false);
      },
      { once: true }
    );
  };

  return (
    <button
      type="button"
      onClick={handleDeepLinkInstall}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
    >
      <span>⚡</span>
      <span>
        {loading
          ? "กำลังเปิด Crystal Access..."
          : `Install with Crystal Access`}
      </span>
    </button>
  );
}