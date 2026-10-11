"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { pluginPrices } from "@/lib/plugin-prices";

export default function PurchaseSuccessContent() {
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
        // Free plugin
        if (freeParam === "true" && pluginParam) {
          setPluginId(pluginParam);
          setLoading(false);
          return;
        } 
        
        // Paid plugin with session
        if (sessionId) {
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
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId, freeParam, pluginParam]);

  const plugin = pluginId ? pluginPrices[pluginId as keyof typeof pluginPrices] : null;
  const pluginName = plugin?.name || pluginId || "Unknown Plugin";
  const targetSlug = pluginId || "drop-tune";
  const deepLink = `crystalcentral://install?slug=${targetSlug}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">กำลังยืนยันการสั่งซื้อ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/profile/invoices"
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            ตรวจสอบใบเสร็จ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6 shadow-lg shadow-cyan-500/20">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">สั่งซื้อสำเร็จ!</h1>
          <p className="text-cyan-400 text-xl font-semibold mb-2">{pluginName}</p>
          <p className="text-gray-400 text-sm">สิทธิ์การใช้งานของคุณพร้อมติดตั้งแล้ว</p>
        </div>

        {/* 🌟 1-Click Deep Link to Crystal Central */}
        <div className="bg-gradient-to-b from-gray-900 to-black border border-cyan-500/40 rounded-2xl p-6 mb-8 shadow-xl shadow-cyan-500/10 text-center">
          <div className="mb-4">
            <span className="inline-block bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Recommended: 1-Click Auto Install
            </span>
            <h2 className="text-xl font-bold text-white">ติดตั้งผ่าน Crystal Central</h2>
            <p className="text-gray-400 text-sm mt-1">
              เปิดแอป Desktop เพื่อดาวน์โหลด ติดตั้ง และเปิดใช้งานอัตโนมัติในคลิกเดียว
            </p>
          </div>

          <a
            href={deepLink}
            className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-lg py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-400/30"
          >
            <span>🚀</span>
            <span>Open in Crystal Central to Install</span>
          </a>

          <p className="text-xs text-gray-500 mt-3">
            ยังไม่มีแอป? <Link href="/download" className="text-cyan-400 underline hover:text-cyan-300">ดาวน์โหลด Crystal Central สำหรับ macOS / Windows</Link>
          </p>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/download"
            className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>ดาวน์โหลดตัวติดตั้ง Manual</span>
          </Link>
          <Link
            href="/profile/invoices"
            className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
          >
            <span>🧾</span>
            <span>ดูใบเสร็จ / License Key</span>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/plugins" className="text-gray-400 hover:text-white transition-colors">
            ← กลับไปหน้าปลั๊กอินทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}
