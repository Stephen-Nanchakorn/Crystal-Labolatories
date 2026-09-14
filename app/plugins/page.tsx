"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencyToggle from "@/app/components/CurrencyToggle";
import { useApp } from "@/app/context/AppContext";

const pluginsData = {
  th: [
    {
      slug: "drop-tune",
      name: "Drop-Tune",
      description: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
      icon: "🎸",
      thb: 0,
      usd: 0,
      isFree: true,
    },
    // ... ปลั๊กอินอื่นๆ
  ],
  en: [
    {
      slug: "drop-tune",
      name: "Drop-Tune",
      description: "Free pitch-shifting plugin for Guitar, Bass, and Keyboard with vintage analog warmth",
      icon: "🎸",
      thb: 0,
      usd: 0,
      isFree: true,
    },
    // ... ปลั๊กอินอื่นๆ
  ],
};

export default function PluginsPage() {
  const { language, currency, t } = useApp();
  const plugins = pluginsData[language];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">CRYSTAL</span>{" "}
            <span className="text-cyan-400">PLUGINS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "th" 
              ? "ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ สำหรับโปรดิวเซอร์สมัยใหม่"
              : "Professional studio-grade audio plugins for modern producers"}
          </p>
        </div>

        {/* เพิ่มปุ่มเลือกสกุลเงินถ้าภาษาไทย (เพราะภาษาอังกฤษใช้ USD เท่านั้น) */}
        {language === "th" && (
          <div className="flex justify-center mb-12">
            <CurrencyToggle currency={currency} setCurrency={() => {}} />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => {
            const price = currency === "THB" ? plugin.thb : plugin.usd;
            const symbol = currency === "THB" ? "฿" : "$";

            return (
              <Link
                key={plugin.slug}
                href={`/plugins/${plugin.slug}`}
                className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-all hover:scale-[1.02]"
              >
                {/* ... รายละเอียดปลั๊กอิน ... */}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}