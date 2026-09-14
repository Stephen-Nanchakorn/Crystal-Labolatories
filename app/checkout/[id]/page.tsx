"use client";

import React, { useState, useEffect } from "react";
import { createCheckoutSession } from "@/lib/stripe";
import { useRouter } from "next/navigation";
import Link from "next/link";
// ❌ ลบบรรทัด import CurrencyContext ออก

const pluginPrices = {
  "drop-tune": { name: "Drop-Tune", usd: 0, thb: 0 },
  "stem-splitter": { name: "Stem Splitter", usd: 99, thb: 3249 },
  "analog-eq": { name: "Analog EQ", usd: 59, thb: 1949 },
};

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  // ✅ สร้าง state สำหรับสกุลเงินในหน้านี้เลย
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ โหลดค่าเก่าจาก localStorage ตอนเปิดหน้า
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") {
      setCurrency(saved);
    }
  }, []);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return <main className="min-h-screen bg-black text-white p-8"><div className="text-center">กำลังโหลด...</div></main>;

  const { id: pluginId } = resolvedParams;
  const plugin = pluginPrices[pluginId as keyof typeof pluginPrices] || { name: "Unknown", usd: 0, thb: 0 };
  const price = currency === "THB" ? plugin.thb : plugin.usd;
  const symbol = currency === "THB" ? "฿" : "$";

  async function handlePurchase() {
    setLoading(true);
    try {
      const baseUrl = "https://crystal-labolatories-zc28.vercel.app";
      const checkoutUrl = await createCheckoutSession(pluginId, 1, currency, `${baseUrl}/purchase-success`, `${baseUrl}/plugins/${pluginId}`);
      if (!checkoutUrl) throw new Error("Failed to create session");
      router.push(checkoutUrl);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ชำระเงิน</h1>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{plugin.name}</h2>
        </div>

        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-cyan-400 mb-3">ราคาสุดท้าย</h3>
          <div className="text-4xl font-bold text-white mb-2">
            {symbol}{price.toLocaleString(currency === "THB" ? "th-TH" : "en-US")}
          </div>
          <div className="text-sm text-gray-500">
            สกุลเงินปัจจุบัน:{" "}
            <button
              onClick={() => setCurrency(currency === "THB" ? "USD" : "THB")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {currency === "THB" ? "บาทไทย (THB)" : "ดอลลาร์สหรัฐ (USD)"}
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }}>
          <button type="submit" disabled={loading} className="w-full bg-cyan-400 py-4 rounded-xl font-bold text-black">
            {loading ? "กำลังดำเนินการ..." : `🛒 ซื้อเลย - ${symbol}${price.toLocaleString()}`}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </main>
  );
}