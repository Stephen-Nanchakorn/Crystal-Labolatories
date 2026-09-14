"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import PriceDisplay from "@/app/components/PriceDisplay";

const pluginsDetail = {
  th: {
    "drop-tune": {
      name: "Drop-Tune",
      description: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
      longDescription: "Drop-Tune เป็นปลั๊กอินปรับจูนเสียงที่ออกแบบมาสำหรับนักกีตาร์และมือเบสโดยเฉพาะ ด้วยอัลกอริทึมที่ให้เสียงอบอุ่นแบบ Analog Gear พร้อมฟีเจอร์ Pitch Shifting แบบ real-time ใช้งานง่าย และประมวลผลเสียงด้วย latency ต่ำสุด",
      icon: "🎸",
      thb: 0,
      usd: 0,
      isFree: true,
      features: [
        "Real-time pitch shifting",
        "Support กีตาร์และเบสทุกประเภท",
        "Analog-style warmth และ saturation",
        "Low CPU usage",
        "Presets สำหรับสไตล์ดนตรีต่างๆ",
        "AU/VST3/AAX formats",
      ],
      requirements: [
        "macOS Ventura ขึ้นไป",
        "CPU: Intel หรือ Apple Silicon",
        "RAM: 4GB ขึ้นไป",
        "DAW: Pro Tools, Logic, Ableton, FL Studio, etc.",
      ],
    },
    "stem-splitter": {
      name: "Stem Splitter",
      description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
      longDescription: "Stem Splitter ใช้เทคโนโลยี AI ล่าสุดในการแยกเสียงดนตรีออกเป็นส่วนต่างๆ ด้วยความแม่นยำสูง แยกได้ถึง 10 stems รวมถึง Vocal, Drums, Bass, Piano, Guitar, Strings และอื่นๆ เหมาะสำหรับรีมิกซ์, มาสเตอร์ริ่ง, และการศึกษาโครงสร้างดนตรี",
      icon: "🧬",
      thb: 3249,
      usd: 99,
      isFree: false,
      features: [
        "AI-powered stem separation",
        "แยกได้สูงสุด 10 stems",
        "Batch processing",
        "Export เป็น multi-track",
        "Preserve audio quality",
        "รองรับไฟล์ WAV, MP3, FLAC",
      ],
      requirements: [
        "macOS Ventura ขึ้นไป",
        "CPU: Apple Silicon (แนะนำ M1 ขึ้นไป)",
        "RAM: 8GB ขึ้นไป",
        "พื้นที่ว่าง: 2GB สำหรับโมเดล AI",
      ],
    },
    "analog-eq": {
      name: "Analog EQ",
      description: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
      longDescription: "Analog EQ นำเสนอประสบการณ์การใช้ EQ แบบ analog ผ่านอินเทอร์เฟซ knob-style ที่ใช้งานง่าย พร้อมฟีเจอร์ gate และ compressor ในตัว ที่ออกแบบมาเพื่อย่านเสียงกีตาร์และเบสโดยเฉพาะ ให้เสียงอบอุ่นและมีความลึกแบบ vintage gear",
      icon: "🎛️",
      thb: 1949,
      usd: 59,
      isFree: false,
      features: [
        "7-band graphic EQ",
        "Built-in gate และ compressor",
        "Analog-style saturation",
        "Guitar/bass-specific presets",
        "Low latency processing",
        "AU/VST3/AAX formats",
      ],
      requirements: [
        "macOS Ventura ขึ้นไป",
        "CPU: Intel หรือ Apple Silicon",
        "RAM: 4GB ขึ้นไป",
        "DAW: ใดก็ได้ที่รองรับ VST3/AU/AAX",
      ],
    },
  },
  en: {
    "drop-tune": {
      name: "Drop-Tune",
      description: "Free pitch-tuning plugin for Guitar, Bass, and Keyboard with warm analog gear character",
      longDescription: "Drop-Tune is a free pitch-shifting plugin designed specifically for guitarists and bassists. Featuring algorithms that deliver warm analog gear tones with real-time pitch shifting, easy-to-use interface, and ultra-low latency audio processing.",
      icon: "🎸",
      thb: 0,
      usd: 0,
      isFree: true,
      features: [
        "Real-time pitch shifting",
        "Supports all guitar and bass types",
        "Analog-style warmth and saturation",
        "Low CPU usage",
        "Presets for various music styles",
        "AU/VST3/AAX formats",
      ],
      requirements: [
        "macOS Ventura or later",
        "CPU: Intel or Apple Silicon",
        "RAM: 4GB or more",
        "DAW: Pro Tools, Logic, Ableton, FL Studio, etc.",
      ],
    },
    "stem-splitter": {
      name: "Stem Splitter",
      description: "AI-powered high-precision stem separation, splitting up to 10 tracks from Vocals to Strings",
      longDescription: "Stem Splitter uses the latest AI technology to separate music into individual stems with high precision. It can extract up to 10 stems including Vocals, Drums, Bass, Piano, Guitar, Strings and more. Perfect for remixing, mastering, and studying musical structures.",
      icon: "🧬",
      thb: 3249,
      usd: 99,
      isFree: false,
      features: [
        "AI-powered stem separation",
        "Up to 10 stem extraction",
        "Batch processing",
        "Multi-track export",
        "Preserves audio quality",
        "Supports WAV, MP3, FLAC files",
      ],
      requirements: [
        "macOS Ventura or later",
        "CPU: Apple Silicon (M1 or newer recommended)",
        "RAM: 8GB or more",
        "Storage: 2GB for AI models",
      ],
    },
    "analog-eq": {
      name: "Analog EQ",
      description: "Classic 7-band knob-style Graphic EQ with built-in Gate and Compressor, designed for Guitar & Bass",
      longDescription: "Analog EQ delivers an authentic analog EQ experience through an intuitive knob-style interface, complete with built-in gate and compressor specifically designed for guitar and bass frequencies. Delivers warm, deep vintage gear tones.",
      icon: "🎛️",
      thb: 1949,
      usd: 59,
      isFree: false,
      features: [
        "7-band graphic EQ",
        "Built-in gate and compressor",
        "Analog-style saturation",
        "Guitar/bass-specific presets",
        "Low latency processing",
        "AU/VST3/AAX formats",
      ],
      requirements: [
        "macOS Ventura or later",
        "CPU: Intel or Apple Silicon",
        "RAM: 4GB or more",
        "DAW: Any VST3/AU/AAX compatible",
      ],
    },
  },
};

export default function PluginDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const { language, currency, t } = useApp();

  useEffect(() => {
    params.then((resolved) => setSlug(resolved.slug));
  }, [params]);

  if (!slug) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  const pluginData = pluginsDetail[language][slug as keyof typeof pluginsDetail.en] || pluginsDetail.en["drop-tune"];
  const isFree = slug === "drop-tune";

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/plugins" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          ← {t("common.back")}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Plugin Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 mb-8">
              <div className="text-6xl">{pluginData.icon}</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{pluginData.name}</h1>
                <p className="text-xl text-gray-300 mb-4">{pluginData.description}</p>
                <div className="flex items-center gap-4">
                  {isFree ? (
                    <span className="bg-green-900 text-green-400 px-4 py-2 rounded-full font-bold">
                      {t("common.free")}
                    </span>
                  ) : (
                    <span className="bg-cyan-900 text-cyan-400 px-4 py-2 rounded-full font-bold">
                      {currency === "THB" ? `฿${pluginData.thb.toLocaleString()}` : `$${pluginData.usd.toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed mb-8">{pluginData.longDescription}</p>

              {/* Features */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">{t("plugin.detail.features")}</h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {pluginData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400 mt-1">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("plugin.detail.requirements")}</h2>
                <ul className="space-y-2">
                  {pluginData.requirements.map((req, idx) => (
                    <li key={idx} className="text-gray-300">• {req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="space-y-6">
            <PriceDisplay pluginId={slug as "drop-tune" | "stem-splitter" | "analog-eq"} currency={currency} />

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">{isFree ? t("common.download") : t("common.buy")}</h3>
              <Link
                href={isFree ? "#download" : `/checkout/${slug}`}
                className={`block w-full text-center font-bold py-4 rounded-lg transition-colors ${isFree ? "bg-green-500 hover:bg-green-600" : "bg-cyan-400 hover:bg-cyan-500"} text-black`}
              >
                {isFree ? `⬇️ ${t("common.download_now")}` : `🛒 ${t("common.buy")}`}
              </Link>
              
              {!isFree && (
                <div className="mt-4 text-sm text-gray-400 text-center">
                  <p>✅ {t("pricing.license")}</p>
                  <p>✅ {t("pricing.updates")}</p>
                  <p>✅ {t("pricing.money_back")}</p>
                </div>
              )}
            </div>

            {/* Compatibility */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">{t("plugin.detail.compatibility")}</h3>
              <div className="space-y-2">
                <p className="text-gray-300">• Pro Tools 2023+</p>
                <p className="text-gray-300">• Logic Pro X</p>
                <p className="text-gray-300">• Ableton Live 11+</p>
                <p className="text-gray-300">• FL Studio 21+</p>
                <p className="text-gray-300">• Cubase 13+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}