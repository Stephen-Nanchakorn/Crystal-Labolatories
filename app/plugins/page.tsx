"use client";

import Link from "next/link";
import { useCurrency } from "@/app/hooks/useCurrency";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    description: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
    icon: "🎸",
    thb: 0,
    usd: 0,
    isFree: true,
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
    icon: "🧬",
    thb: 3249,
    usd: 99,
    isFree: false,
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    description: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
    icon: "🎛️",
    thb: 1949,
    usd: 59,
    isFree: false,
  },
];

export default function PluginsPage() {
  const { currency, mounted } = useCurrency();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">CRYSTAL</span>{" "}
            <span className="text-cyan-400">PLUGINS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ สำหรับโปรดิวเซอร์สมัยใหม่
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => {
            // ✅ คำนวณราคาตามสกุลเงินที่เลือก
            const price = currency === "THB" ? plugin.thb : plugin.usd;
            const symbol = currency === "THB" ? "฿" : "$";

            return (
              <Link
                key={plugin.slug}
                href={`/plugins/${plugin.slug}`}
                className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-all hover:scale-[1.02]"
              >
                <div className="text-5xl mb-4">{plugin.icon}</div>

                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{plugin.name}</h3>
                    <div className={`font-bold ${plugin.isFree ? "text-green-400" : "text-cyan-400"}`}>
                      {plugin.isFree ? "FREE" : mounted ? `${symbol}${price.toLocaleString()}` : "..."}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {plugin.description}
                  </p>
                </div>

                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <div>• ใช้งานกับ Pro Tools, Logic, Ableton</div>
                  <div>• MacOS Ventura ขึ้นไป</div>
                  <div>• AU, VST3, AAX formats</div>
                </div>

                <div className="text-center">
                  <div className="inline-block bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg group-hover:bg-cyan-500 transition-colors">
                    {plugin.isFree ? "📥 ดาวน์โหลดฟรี" : "🛒 ซื้อทันที"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}