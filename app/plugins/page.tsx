import Link from "next/link";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    description: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
    priceUSD: 0, // ฟรี
    icon: "🎸",
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
    priceUSD: 29.99,
    icon: "🧬",
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    description: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
    priceUSD: 19.99,
    icon: "🎛️",
  },
];

export default function PluginsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">CRYSTAL</span>{" "}
            <span className="text-cyan-400">PLUGINS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ สำหรับโปรดิวเซอร์สมัยใหม่
            ผลิตบน Mac Studio M4 Max เพื่อประสิทธิภาพสูงสุด
          </p>
        </div>

        {/* Plugin Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plugins.map((plugin) => (
            <div
              key={plugin.slug}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-colors"
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{plugin.icon}</div>
              
              {/* Name & Price */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">{plugin.name}</h3>
                <div className="text-cyan-400 font-bold">
                  {plugin.priceUSD === 0 ? "FREE" : `$${plugin.priceUSD}`}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{plugin.description}</p>
              
              {/* Features */}
              <div className="text-sm text-gray-500 mb-6 space-y-1">
                <div>• ใช้งานกับ Pro Tools, Logic, Ableton</div>
                <div>• MacOS Ventura ขึ้นไป</div>
                <div>• ARM64 Native (M4 Max Optimized)</div>
              </div>
              
              {/* CTA Button */}
              <Link
                href={`/plugins/${plugin.slug}`}
                className="block text-center bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg transition-colors"
              >
                {plugin.priceUSD === 0 ? "📥 ดาวน์โหลดฟรี" : "🛒 ซื้อเลย"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}