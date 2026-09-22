"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { pluginPrices, type PluginId } from "@/lib/plugin-prices";

export default function PurchaseSuccessPage() {
  const { language } = useApp();
  const searchParams = useSearchParams();

  const [pluginId, setPluginId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const freeParam = searchParams.get("free");
  const pluginParam = searchParams.get("plugin");

  useEffect(() => {
    async function verify() {
      try {
        if (freeParam === "true" && pluginParam) {
          // ปลั๊กอินฟรี — ถูกบันทึกไปแล้วตอนกดซื้อในหน้า checkout
          setPluginId(pluginParam);
        } else if (sessionId) {
          // ✅ เรียก server verify แทนการ insert ตรงจาก client (ปลอดภัยกว่า)
          const res = await fetch(`/api/verify-checkout-session?session_id=${sessionId}`);
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || "ไม่สามารถยืนยันการชำระเงินได้");
          }

          setPluginId(data.pluginId);
        } else {
          throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
        }
      } catch (err: any) {
        console.error("Error verifying purchase:", err);
        setError(err.message || (language === "th" ? "เกิดข้อผิดพลาด" : "An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId, freeParam, pluginParam, language]);

  const plugin = pluginId ? pluginPrices[pluginId as PluginId] : null;
  const pluginName = plugin?.name || pluginId || "Unknown";

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">
            {language === "th" ? "กำลังยืนยันการสั่งซื้อ..." : "Verifying your purchase..."}
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">
            {language === "th" ? "เกิดข้อผิดพลาด" : "Error"}
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/profile/invoices"
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            {language === "th" ? "ตรวจสอบใบเสร็จ" : "Check Invoices"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {language === "th" ? "สั่งซื้อสำเร็จ!" : "Purchase Successful!"}
          </h1>
          <p className="text-gray-400 text-lg">{pluginName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/download"
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-xl text-center transition-colors"
          >
            📥 {language === "th" ? "ไปหน้าดาวน์โหลด" : "Go to Downloads"}
          </Link>
          <Link
            href="/profile/invoices"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-4 rounded-xl text-center transition-colors"
          >
            🧾 {language === "th" ? "ดูใบเสร็จ" : "View Invoice"}
          </Link>
        </div>

        <div className="text-center">
          <Link href="/plugins" className="text-gray-400 hover:text-white">
            ← {language === "th" ? "กลับไปหน้าปลั๊กอิน" : "Back to Plugins"}
          </Link>
        </div>
      </div>
    </main>
  );
}