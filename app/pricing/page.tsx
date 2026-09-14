"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencyToggle from "@/app/components/CurrencyToggle";
import { useApp } from "@/app/context/AppContext";

export default function PricingPage() {
  const { language, currency, setCurrency, t } = useApp();

  // Pricing data
  const plugins = [
    {
      slug: "drop-tune",
      name: "Drop-Tune",
      description: language === "th" 
        ? "ปรับจูนเสียงฟรี สำหรับ Guitar, Bass, Keyboard"
        : "Free pitch-tuning for Guitar, Bass, Keyboard",
      thb: 0,
      usd: 0,
      isFree: true,
      features: [
        language === "th" ? "Pitch shifting แบบ real-time" : "Real-time pitch shifting",
        language === "th" ? "Support กีตาร์และเบส" : "Guitar & bass support",
        language === "th" ? "Analog-style warmth" : "Analog-style warmth",
        language === "th" ? "AU/VST3/AAX formats" : "AU/VST3/AAX formats",
      ],
    },
    {
      slug: "stem-splitter",
      name: "Stem Splitter",
      description: language === "th"
        ? "แยกเสียงดนตรีด้วย AI ความละเอียดสูง"
        : "AI-powered stem separation",
      thb: 3249,
      usd: 99,
      isFree: false,
      features: [
        language === "th" ? "แยกได้ถึง 10 stems" : "Up to 10 stem separation",
        language === "th" ? "AI ความละเอียดสูง" : "High-precision AI",
        language === "th" ? "Batch processing" : "Batch processing",
        language === "th" ? "Export multi-track" : "Multi-track export",
      ],
    },
    {
      slug: "analog-eq",
      name: "Analog EQ",
      description: language === "th"
        ? "Graphic EQ 7-Band พร้อม Gate และ Compressor"
        : "7-band Graphic EQ with Gate & Compressor",
      thb: 1949,
      usd: 59,
      isFree: false,
      features: [
        language === "th" ? "7-band EQ แบบ analog" : "7-band analog-style EQ",
        language === "th" ? "Built-in gate และ compressor" : "Built-in gate & compressor",
        language === "th" ? "Presets สำหรับกีตาร์/เบส" : "Guitar/bass presets",
        language === "th" ? "Low CPU usage" : "Low CPU usage",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            {t("pricing.title")} <span className="text-cyan-400">{t("pricing.subtitle")}</span>
          </h1>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-12">
          <CurrencyToggle currency={currency} setCurrency={setCurrency} />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => {
            const price = currency === "THB" ? plugin.thb : plugin.usd;
            const symbol = currency === "THB" ? "฿" : "$";
            const otherPrice = currency === "THB" ? plugin.usd : plugin.thb;
            const otherSymbol = currency === "THB" ? "$" : "฿";

            return (
              <div
                key={plugin.slug}
                className={`bg-gray-900 border rounded-2xl p-6 ${plugin.isFree ? "border-green-500/30" : "border-gray-800"}`}
              >
                <div className={`text-center p-4 rounded-xl mb-6 ${plugin.isFree ? "bg-green-900/20" : "bg-gray-800"}`}>
                  <h3 className="text-xl font-semibold mb-1">{plugin.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plugin.description}</p>
                  
                  {plugin.isFree ? (
                    <div className="text-3xl font-bold text-green-400">{t("common.free")}</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">
                        {symbol}
                        {price.toLocaleString()}{" "}
                        <span className="text-sm text-gray-400">
                          {currency === "THB" ? t("common.thb") : t("common.usd")}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        ≈ {otherSymbol}
                        {otherPrice.toLocaleString()} {currency === "THB" ? t("common.usd") : t("common.thb")}
                      </p>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-cyan-400 mb-3">{t("pricing.features")}</h4>
                  <ul className="space-y-2">
                    {plugin.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-green-400">✓</span> {feature}
                      </li>
                    ))}
                    <li className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t("pricing.license")}
                    </li>
                    <li className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t("pricing.updates")}
                    </li>
                    <li className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t("pricing.money_back")}
                    </li>
                  </ul>
                </div>

                <Link
                  href={plugin.isFree ? `/plugins/${plugin.slug}` : `/checkout/${plugin.slug}`}
                  className={`block text-center font-bold py-3 rounded-lg transition-colors ${
                    plugin.isFree
                      ? "bg-green-500 hover:bg-green-600 text-black"
                      : "bg-cyan-400 hover:bg-cyan-500 text-black"
                  }`}
                >
                  {plugin.isFree ? t("common.download_now") : t("common.buy")}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}