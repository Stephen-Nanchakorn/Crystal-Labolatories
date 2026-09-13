"use client";

import { useState } from "react";
import Link from "next/link";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    description: "ปรับจูนเสียงฟรี สำหรับ Guitar, Bass, Keyboard",
    priceTHB: 0,
    priceUSD: 0,
    isFree: true,
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง",
    priceTHB: 3249,
    priceUSD: 99,
    isFree: false,
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    description: "Graphic EQ 7-Band พร้อม Gate และ Compressor",
    priceTHB: 1949,
    priceUSD: 59,
    isFree: false,
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Pricing <span className="text-cyan-400">แผนราคา</span>
          </h1>
          <p className="text-gray-400">
            เลือกปลั๊กอินที่ใช่สำหรับ workflow ของคุณ
          </p>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-gray-800 p-1">
            <button
              onClick={() => setCurrency("THB")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                currency === "THB"
                  ? "bg-cyan-400 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🇹🇭 ไทย (บาท)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                currency === "USD"
                  ? "bg-cyan-400 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🇺🇸 สากล (ดอลลาร์)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <div
              key={plugin.slug}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-colors"
            >
              {/* Plugin Name */}
              <h3 className="text-xl font-bold mb-1">{plugin.name}</h3>
              <p className="text-gray-400 text-sm mb-6">
                {plugin.description}
              </p>

              {/* Price Box */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-cyan-400 text-sm font-medium">
                    ราคา {currency === "THB" ? "(บาท)" : "(ดอลลาร์)"}
                  </span>
                </div>

                {plugin.isFree ? (
                  <div className="text-4xl font-bold text-green-400">
                    FREE
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">
                    {currency === "THB" ? "฿" : "$"}
                    {currency === "THB"
                      ? plugin.priceTHB.toLocaleString("th-TH")
                      : plugin.priceUSD.toLocaleString("en-US")}
                    <span className="text-lg text-gray-400 ml-2">
                      {currency === "THB" ? "บาท" : "USD"}
                    </span>
                  </div>
                )}

                {/* ราคาในอีกสกุล (แสดงไว้ข้างล่าง) */}
                {!plugin.isFree && (
                  <div className="text-sm text-gray-500 mt-2">
                    {currency === "THB"
                      ? `≈ $${plugin.priceUSD} USD`
                      : `≈ ฿${plugin.priceTHB.toLocaleString("th-TH")} THB`}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={`/plugins/${plugin.slug}`}
                className={`block text-center font-bold py-3 rounded-lg transition-colors ${
                  plugin.isFree
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-cyan-400 hover:bg-cyan-500 text-black"
                }`}
              >
                {plugin.isFree ? "📥 ดาวน์โหลดฟรี" : "🛒 ซื้อทันที"}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            ✅ การันตีคืนเงินภายใน 30 วัน • ✅ License ตลอดชีพ • ✅ อัปเดตฟรี
          </p>
        </div>
      </div>
    </main>
  );
}