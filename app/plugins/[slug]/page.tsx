"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import PriceDisplay from "@/app/components/PriceDisplay";
import { createClient } from "@/lib/supabase/client";

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
      name: "Stem Splitter Pro",
      description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 11 ส่วน ตั้งแต่ Vocal ไปจนถึง Guitar & Strings Specialist",
      longDescription: "Stem Splitter Pro ใช้เทคโนโลยี Mel-Band RoFormer AI ล่าสุดในการแยกเสียงดนตรีออกเป็นส่วนต่างๆ ด้วยความแม่นยำระดับสตูดิโอ แยกได้ถึง 11 stems รวมถึง Lead/Backing Vocal, Drums, Bass, Synth Bass, Electric Guitar, Acoustic Guitar, Piano, Synth, Strings และ Other",
      icon: "🧬",
      thb: 3249,
      usd: 99,
      isFree: false,
      features: [
        "AI-powered 11-stem separation",
        "Specialist Models: Guitars, Bass, Synth & Strings",
        "Round-trip 48 kHz 24-bit PCM Master Audio",
        "Batch processing & Multi-track export",
        "Preserve dynamic range & phase alignment",
        "รองรับไฟล์ WAV, MP3, FLAC, AIFF",
      ],
      requirements: [
        "macOS Ventura ขึ้นไป",
        "CPU: Apple Silicon (แนะนำ M1 ขึ้นไป) หรือ Intel Core i7+",
        "RAM: 8GB ขึ้นไป (แนะนำ 16GB)",
        "พื้นที่ว่าง: 4GB สำหรับโมเดล AI",
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
      name: "Stem Splitter Pro",
      description: "AI-powered high-precision stem separation, splitting up to 11 tracks from Vocals to Specialist Guitars & Strings",
      longDescription: "Stem Splitter Pro uses the state-of-the-art Mel-Band RoFormer AI technology to separate music into individual studio stems with unparalleled precision. Extracts up to 11 stems including Lead/Backing Vocals, Drums, Bass, Synth Bass, Electric Guitar, Acoustic Guitar, Piano, Synth, Strings, and Other.",
      icon: "🧬",
      thb: 3249,
      usd: 99,
      isFree: false,
      features: [
        "AI-powered 11-stem separation",
        "Specialist Models: Guitars, Bass, Synth & Strings",
        "Round-trip 48 kHz 24-bit PCM Master Audio",
        "Batch processing & Multi-track export",
        "Preserves dynamic range & phase alignment",
        "Supports WAV, MP3, FLAC, AIFF files",
      ],
      requirements: [
        "macOS Ventura or later",
        "CPU: Apple Silicon (M1 or newer recommended) or Intel Core i7+",
        "RAM: 8GB or more (16GB recommended)",
        "Storage: 4GB for AI models",
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
  const router = useRouter();
  const supabase = createClient();

  // Trial & Claim state
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState<string | null>(null);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [claimFreeLoading, setClaimFreeLoading] = useState(false);
  const [claimFreeSuccess, setClaimFreeSuccess] = useState(false);

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
  const centralInstallLink = `crystalcentral://install?slug=${slug}`;

  // จัดการกดรับ Trial 14 วัน
  async function handleStartTrial() {
    setTrialLoading(true);
    setTrialError(null);
    setTrialSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?redirect=/plugins/${slug}`);
        return;
      }

      const res = await fetch("/api/v1/licenses/trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plugin_id: slug,
          plugin_name: pluginData.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to activate trial");
      }

      const expiryDate = data.license?.expires_at
        ? new Date(data.license.expires_at).toLocaleDateString()
        : "14 วัน";

      setTrialSuccess(
        language === "th"
          ? `เปิดใช้งานสิทธิ์ทดลองใช้ 14 วันสำเร็จ! หมดอายุวันที่: ${expiryDate}`
          : `14-Day Free Trial activated successfully! Valid until: ${expiryDate}`
      );
    } catch (err: any) {
      setTrialError(err.message || "Failed to start trial");
    } finally {
      setTrialLoading(false);
    }
  }

  // จัดการรับปลั๊กอินฟรี 1-Click
  async function handleClaimFree() {
    setClaimFreeLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/plugins/${slug}`);
        return;
      }

      const res = await fetch("/api/plugins/claim-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId: slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim free plugin");

      setClaimFreeSuccess(true);
    } catch (err: any) {
      alert(err.message || "Error claiming free plugin");
    } finally {
      setClaimFreeLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/plugins" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
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
                    <span className="bg-green-900/60 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full font-bold">
                      {t("common.free")}
                    </span>
                  ) : (
                    <span className="bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full font-bold">
                      {currency === "THB" ? `฿${pluginData.thb.toLocaleString()}` : `$${pluginData.usd.toLocaleString()}`}
                    </span>
                  )}
                  {!isFree && (
                    <span className="bg-purple-900/60 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                      ✨ 14-Day Free Trial Available
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

            {/* Trial & Purchase Action Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                {isFree ? t("common.download") : t("common.buy")}
              </h3>

              {isFree ? (
                <div>
                  {claimFreeSuccess ? (
                    <div className="text-center space-y-4">
                      <div className="bg-green-950/60 border border-green-500/40 text-green-300 p-4 rounded-xl text-sm font-semibold">
                        🎉 เพิ่มสิทธิ์ Drop-Tune ลงในบัญชีเรียบร้อยแล้ว!
                      </div>
                      <a
                        href={centralInstallLink}
                        className="block w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-black py-4 rounded-xl text-center shadow-lg shadow-green-500/20 transition-all transform hover:scale-[1.02]"
                      >
                        🚀 Open in Crystal Central to Install
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleClaimFree}
                      disabled={claimFreeLoading}
                      className="block w-full text-center font-black py-4 rounded-xl transition-all bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20"
                    >
                      {claimFreeLoading ? "กำลังรับสิทธิ์..." : `⬇️ ${t("common.download_now")} (ฟรี 100%)`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Buy Lifetime License */}
                  <Link
                    href={`/checkout/${slug}`}
                    className="block w-full text-center font-black py-4 rounded-xl transition-all bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-400/20 transform hover:scale-[1.01]"
                  >
                    🛒 {language === "th" ? "ซื้อสิทธิ์ขาด (Lifetime License)" : "Buy Lifetime License"}
                  </Link>

                  {/* 🌟 14-Day Free Trial Button */}
                  {trialSuccess ? (
                    <div className="bg-purple-950/60 border border-purple-500/40 p-4 rounded-xl space-y-3 mt-4">
                      <p className="text-purple-300 text-sm font-medium text-center">
                        {trialSuccess}
                      </p>
                      <a
                        href={centralInstallLink}
                        className="block w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold py-3 rounded-lg text-center shadow-lg transition-all"
                      >
                        🚀 Open in Crystal Central to Install
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartTrial}
                      disabled={trialLoading}
                      className="block w-full text-center font-bold py-3.5 rounded-xl border border-purple-500/60 bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 transition-all shadow-md hover:border-purple-400 disabled:opacity-50"
                    >
                      {trialLoading ? "กำลังเปิดสิทธิ์ Trial..." : "⚡ Start 14-Day Free Trial"}
                    </button>
                  )}

                  {trialError && (
                    <p className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-lg border border-red-800/40 text-center">
                      {trialError}
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                เปิดใช้งานได้ 2 เครื่องพร้อมกัน • รองรับทั้ง VST3 & AU บน macOS / Windows
              </p>
            </div>

            {/* Compatibility */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">{t("plugin.detail.compatibility")}</h3>
              <div className="space-y-2">
                <p className="text-gray-300">• Pro Tools 2023+ (AAX via Central)</p>
                <p className="text-gray-300">• Logic Pro X (AudioUnit v2/v3)</p>
                <p className="text-gray-300">• Ableton Live 11+ (VST3/AU)</p>
                <p className="text-gray-300">• FL Studio 21+ (VST3)</p>
                <p className="text-gray-300">• Cubase 13+ (VST3)</p>
                <p className="text-gray-300">• Studio One 6+ (VST3/AU)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
