"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencyToggle from "@/app/components/CurrencyToggle";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    description: "ปรับจูนเสียงฟรี สำหรับ Guitar, Bass, Keyboard",
    thb: 0,
    usd: 0,
    isFree: true,
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง",
    thb: 3249,
    usd: 99,
    isFree: false,
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    description: "Graphic EQ 7-Band พร้อม Gate และ Compressor",
    thb: 1949,
    usd: 59,
    isFree: false,
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Pricing <span className="text-cyan-400">แผนราคา</span>
          </h1>
          <p className="text-gray-400">เลือกปลั๊กอินที่ใช่สำหรับ workflow ของคุณ</p>
        </div>

        {/* ✅ Currency Toggle พร้อม Sliding Effect */}
        <div className="flex justify-center mb-10">
          <CurrencyToggle currency={currency} setCurrency={setCurrency} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => {
            const price = currency === "THB" ? plugin.thb : plugin.usd;
            const symbol = currency === "THB" ? "฿" : "$";
            const otherPrice = currency === "THB" ? plugin.usd : plugin.thb;
            const otherSymbol = currency === "THB" ? "$" : "฿";

            return (
              <div
                key={plugin.slug}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-1">{plugin.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plugin.description}</p>

                <div className="bg-gray-800 rounded-xl p-4 mb-4">
                  <p className="text-cyan-400 text-sm mb-1">
                    ราคา ({currency === "THB" ? "บาท" : "ดอลลาร์"})
                  </p>
                  {plugin.isFree ? (
                    <div className="text-3xl font-bold text-green-400">FREE</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">
                        {symbol}
                        {price.toLocaleString()}{" "}
                        <span className="text-sm text-gray-400">
                          {currency === "THB" ? "บาท" : "USD"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        ≈ {otherSymbol}
                        {otherPrice.toLocaleString()} {currency === "THB" ? "USD" : "THB"}
                      </p>
                    </>
                  )}
                </div>

                <Link
                  href={plugin.isFree ? `/plugins/${plugin.slug}` : `/checkout/${plugin.slug}`}
                  className={`block text-center font-bold py-3 rounded-lg transition-colors ${
                    plugin.isFree
                      ? "bg-green-500 hover:bg-green-600 text-black"
                      : "bg-cyan-400 hover:bg-cyan-500 text-black"
                  }`}
                >
                  {plugin.isFree ? "📥 ดาวน์โหลดฟรี" : "🛒 ซื้อทันที"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}