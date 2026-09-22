"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pluginPrices, type PluginId } from "@/lib/plugin-prices";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") setCurrency(saved);
  }, []);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="text-center">กำลังโหลด...</div>
      </main>
    );
  }

  const { id: pluginId } = resolvedParams;
  const plugin = pluginPrices[pluginId as PluginId] || { name: "Unknown", usd: 0, thb: 0 };
  const price = currency === "THB" ? plugin.thb : plugin.usd;
  const symbol = currency === "THB" ? "฿" : "$";

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      // ✅ ต้อง login ก่อนถึงจะซื้อได้ เพราะต้องมี userId ส่งเข้า Stripe metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/checkout/${pluginId}`);
        return;
      }

      const baseUrl = window.location.origin;

      // ปลั๊กอินฟรี → เรียก API claim-free แทน ไม่ต้องผ่าน Stripe
      if (pluginId === "drop-tune") {
        const res = await fetch("/api/plugins/claim-free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pluginId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to claim free plugin");
        router.push(`/purchase-success?plugin=${pluginId}&free=true`);
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pluginId,
          quantity: 1,
          currency,
          successUrl: `${baseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/plugins/${pluginId}`,
          userId: user.id,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      router.push(data.url);
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
          <h3 className="text-cyan-400 mb-3">ราคาสุทธิ</h3>
          <div className="text-4xl font-bold text-white mb-2">
            {symbol}
            {price.toLocaleString(currency === "THB" ? "th-TH" : "en-US")}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 py-4 rounded-xl font-bold text-black disabled:opacity-50"
          >
            {loading ? "กำลังดำเนินการ..." : `🛒 ซื้อเลย - ${symbol}${price.toLocaleString()}`}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </main>
  );
}