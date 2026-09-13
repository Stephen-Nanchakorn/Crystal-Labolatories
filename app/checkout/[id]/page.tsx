"use client";

import React, { useState, useEffect } from "react";
import { createCheckoutSession } from "@/lib/stripe";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Custom hook สำหรับสกุลเงิน
const useCurrency = () => {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") {
      setCurrency(saved);
    }
  }, []);

  useEffect(() => {
    if (currency) {
      localStorage.setItem("currency", currency);
    }
  }, [currency]);

  return { currency, setCurrency };
};

// ข้อมูลราคาปลั๊กอิน
const pluginPrices = {
  "drop-tune": {
    name: "Drop-Tune",
    usd: 0,
    thb: 0,
  },
  "stem-splitter": {
    name: "Stem Splitter",
    usd: 99,
    thb: 3249,
  },
  "analog-eq": {
    name: "Analog EQ",
    usd: 59,
    thb: 1949,
  },
};

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ใช้ useEffect แทน React.use() เพราะ React.use() ใช้ใน Server Components
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  const { id: pluginId } = resolvedParams;

  const plugin = pluginPrices[pluginId as keyof typeof pluginPrices] || {
    name: "Unknown Plugin",
    usd: 1999,
    thb: 69965,
  };

  // คำนวณราคาตามสกุลเงินที่เลือก
  const price = currency === "THB" ? plugin.thb : plugin.usd;
  const symbol = currency === "THB" ? "฿" : "$";

  async function handlePurchase() {
    setLoading(true);
    setError("");

    try {
      // ใช้ URL ตรงๆ
      const baseUrl = "https://crystal-labolatories-zc28.vercel.app";
      const successUrl = `${baseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/plugins/${pluginId}`;

      const checkoutUrl = await createCheckoutSession(
        pluginId,
        1,
        currency,
        successUrl,
        cancelUrl
      );

      if (!checkoutUrl) {
        throw new Error("Failed to create checkout session");
      }

      // ใช้ router แทน redirect ใน client component
      router.push(checkoutUrl);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการชำระเงิน");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {" > "}
          <Link href="/plugins" className="hover:text-white">
            Plugins
          </Link>
          {" > "}
          <span className="text-cyan-400">{plugin.name}</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">ชำระเงิน</h1>

        {/* Product Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{plugin.name}</h2>
          <p className="text-gray-400">License: Lifetime, Updates Included</p>
          <p className="text-gray-400 text-sm mt-2">
            หลังจากซื้อเสร็จ คุณจะได้รับ:
          </p>
          <ul className="text-gray-400 text-sm space-y-1 mt-2">
            <li>• License key ทางอีเมลภายใน 5 นาที</li>
            <li>• Link ดาวน์โหลดปลั๊กอิน</li>
            <li>• การอัปเดตฟรีตลอดชีพ</li>
            <li>• สิทธิการคืนเงินภายใน 30 วัน</li>
          </ul>
        </div>

        {/* Price Display */}
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-cyan-400">ราคาสุดท้าย</h3>
            <span className="text-xs text-gray-500">
              {currency === "THB" ? "(บาท)" : "(ดอลลาร์)"}
            </span>
          </div>

          <div className="text-4xl font-bold text-white mb-2">
            {symbol}
            {price.toLocaleString(currency === "THB" ? "th-TH" : "en-US")}
          </div>

          <div className="text-sm text-gray-500">
            {/* แสดงสกุลเงินที่เลือกอยู่ */}
            <span className="inline-flex items-center gap-1">
              สกุลเงินปัจจุบัน:{" "}
              <span className="text-cyan-300 font-medium">
                {currency === "THB" ? "บาทไทย (THB)" : "ดอลลาร์สหรัฐ (USD)"}
              </span>
            </span>
            <span className="mx-2">•</span>
            <Link
              href="/profile"
              className="text-cyan-400 hover:text-cyan-300"
            >
              เปลี่ยนสกุลเงิน
            </Link>
          </div>
        </div>

        {/* Payment Button */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handlePurchase();
          }} 
          className="mt-8"
        >
          <button
            type="submit"
            disabled={loading || plugin.usd === 0}
            className={`w-full font-bold py-4 rounded-xl text-lg transition-all ${
              plugin.usd === 0
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : loading
                ? "bg-cyan-500 text-black opacity-80"
                : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black hover:shadow-lg hover:shadow-cyan-500/20"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                กำลังดำเนินการ...
              </span>
            ) : plugin.usd === 0 ? (
              "ฟรี - ไม่ต้องชำระเงิน"
            ) : (
              `🛒 ซื้อเลย - ${symbol}${price.toLocaleString(currency === "THB" ? "th-TH" : "en-US")}`
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            <strong>ข้อผิดพลาด:</strong> {error}
          </div>
        )}

        {/* Security Notes */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">
            <span className="text-green-400">✓</span> การชำระเงินใช้{" "}
            <strong>Stripe</strong> ที่ปลอดภัยระดับโลก
          </p>
          <p>
            <span className="text-green-400">✓</span> ข้อมูลบัตรเครดิตของคุณจะไม่ถูกเก็บในเซิร์ฟเวอร์ของเรา
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href={`/plugins/${pluginId}`}
            className="text-gray-400 hover:text-white inline-flex items-center gap-1"
          >
            ← กลับไปหน้ารายละเอียดปลั๊กอิน
          </Link>
        </div>
      </div>
    </main>
  );
}