import PriceDisplay from "@/app/components/PriceDisplay";
import Link from "next/link";

const pluginData: Record<string, any> = {
  "drop-tune": {
    name: "Drop-Tune",
    tagline: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard",
    description: `
      Drop-Tune เป็นปลั๊กอินปรับจูนเสียงแบบ Real-time ที่ให้กลิ่นอายเสียงแบบ Analog Gear
      ใช้งานง่าย เหมาะสำหรับมือกีต้าร์, เบส และคีย์บอร์ดที่ต้องการปรับแต่งเสียงแบบดั้งเดิม
      แต่มีประสิทธิภาพสูงในการปรับจูนและการควบคุมเสียง
    `,
    priceTHB: 0,
    priceUSD: 0,
    isFree: true,
    features: [
      "Real-time pitch shifting",
      "Guitar, Bass, Keyboard modes",
      "Analog warmth simulation",
      "Low-latency processing",
      "64-bit floating point",
    ],
    systemRequirements: [
      "MacOS Ventura 13.0+",
      "Pro Tools 2023+, Logic Pro X, Ableton Live 11+",
      "2GB RAM minimum",
      "AU, VST3, AAX formats",
    ],
    demoUrl: "/demo/drop-tune",
    icon: "🎸",
  },
  "stem-splitter": {
    name: "Stem Splitter",
    tagline: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง",
    description: `
      Stem Splitter ใช้เทคโนโลยี AI ล้ำสมัยในการแยกเสียงดนตรีออกเป็นส่วนๆ
      แยกได้ละเอียดถึง 10 ส่วน ตั้งแต่ Vocal, Drum, Bass, Guitar, Piano,
      Strings, Brass, Synthesizer และอีกมากมาย
    `,
    priceTHB: 3249,
    priceUSD: 99,
    isFree: false,
    features: [
      "AI-powered stem separation",
      "10 stem types: Vocal, Drum, Bass, Guitar, Piano, Strings, etc.",
      "Batch processing",
      "High-quality 24-bit output",
      "Custom separation models",
    ],
    systemRequirements: [
      "MacOS Ventura 13.0+",
      "8GB RAM minimum (16GB recommended)",
      "200MB free disk space",
      "AU, VST3, AAX formats",
    ],
    demoUrl: "/demo/stem-splitter",
    icon: "🧬",
  },
  "analog-eq": {
    name: "Analog EQ",
    tagline: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor",
    description: `
      Analog EQ เป็น Graphic Equalizer แบบ 7-Band ที่ออกแบบมาโดยเฉพาะสำหรับ
      Guitar และ Bass เสียงแบบ Analog warm tone พร้อม Gate และ Compressor
      ในตัวเพื่อให้เสียงมีความสมบูรณ์แบบในปลั๊กอินเดียว
    `,
    priceTHB: 1949,
    priceUSD: 59,
    isFree: false,
    features: [
      "7-band graphic EQ with analog modeling",
      "Built-in Noise Gate",
      "Built-in Compressor",
      "Guitar & Bass optimized presets",
      "Vintage and Modern modes",
    ],
    systemRequirements: [
      "MacOS Ventura 13.0+",
      "Pro Tools 2023+, Logic Pro X, Ableton Live 11+",
      "4GB RAM minimum",
      "AU, VST3, AAX formats",
    ],
    demoUrl: "/demo/analog-eq",
    icon: "🎛️",
  },
};

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = pluginData[slug];

  if (!plugin) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Plugin Not Found</h1>
          <p className="text-gray-400 mb-6">
            ปลั๊กอินที่คุณต้องการดูไม่พบในระบบ
          </p>
          <Link
            href="/plugins"
            className="inline-block bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg"
          >
            กลับไปหน้ารายการปลั๊กอิน
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div>
            {/* Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">{plugin.icon}</div>
              <div>
                <h1 className="text-4xl font-bold">{plugin.name}</h1>
                <p className="text-xl text-cyan-400">{plugin.tagline}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-8 whitespace-pre-line">
              {plugin.description}
            </p>

            {/* Price & Buy Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              {plugin.isFree ? (
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-4">
                    FREE! 🎉
                  </div>
                  <a
                    href={plugin.demoUrl}
                    className="block text-center bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-xl text-lg"
                  >
                    📥 ดาวน์โหลดฟรีทันที
                  </a>
                </div>
              ) : (
                <>
                  <PriceDisplay
                    usdPrice={plugin.priceUSD}
                    thbPrice={plugin.priceTHB}
                  />
                  <div className="mt-6 space-y-3">
                    <Link
                      href={`/checkout/${slug}`}
                      className="block text-center bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold py-4 rounded-xl text-lg"
                    >
                      🛒 ซื้อเลย - รับ License ทันที
                    </Link>
                    <a
                      href={plugin.demoUrl}
                      className="block text-center border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold py-4 rounded-xl"
                    >
                      🎧 ดาวน์โหลดเวอร์ชันทดลองฟรี
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                ฟีเจอร์หลัก
              </h2>
              <ul className="space-y-3">
                {plugin.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Demo & Requirements */}
          <div>
            {/* System Requirements */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                ข้อกำหนดระบบ
              </h2>
              <ul className="space-y-3">
                {plugin.systemRequirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Demo Placeholder */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">ตัวอย่างเสียง</h2>
              <div className="aspect-video bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-lg flex flex-col items-center justify-center p-8">
                <div className="text-8xl mb-6">{plugin.icon}</div>
                <p className="text-center text-gray-400 mb-4">
                  {plugin.name} - Sound Demo
                </p>
                <div className="w-full h-2 bg-gray-700 rounded-full mb-2"></div>
                <div className="w-full h-1 bg-gray-800 rounded-full"></div>
                <div className="flex justify-between w-full mt-4 text-sm text-gray-500">
                  <span>Dry</span>
                  <span>Wet</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <a
                  href={plugin.demoUrl}
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2"
                >
                  🎧 ฟังตัวอย่างเสียงทั้งหมด →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}