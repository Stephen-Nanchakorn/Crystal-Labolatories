import PriceDisplay from "@/app/components/PriceDisplay";
import Link from "next/link";

// Mock data - ต่อไปดึงจาก Supabase/Database
const pluginData: Record<string, any> = {
  "crystal-compressor": {
    name: "Crystal Compressor",
    description: "คอนเพรสเซอร์เสียงระดับสตูดิโอที่แม่นยำที่สุดในตลาด",
    longDescription: `
      Crystal Compressor เป็นคอนเพรสเซอร์เสียงระดับมืออาชีพที่ออกแบบมาเพื่อโปรดิวเซอร์
      และเอนจิเนียร์ที่ต้องการควบคุมไดนามิกส์อย่างละเอียด ด้วยอัลกอริธึมการบีบอัดแบบคลาส A
      และฟีเจอร์เช่น Auto-Gain, Sidechain, และ Parallel Compression
      ทำให้สามารถใช้งานได้กับทุกประเภทของเสียง
    `,
    priceUSD: 49.99,
    features: [
      "Vintage and Modern compression modes",
      "Auto-Gain compensation",
      "Sidechain filtering",
      "Parallel compression control",
      "64-bit floating point processing",
      "ARM64 Native for M4 Max",
    ],
    systemRequirements: [
      "MacOS Ventura 13.0+",
      "Pro Tools 2023+, Logic Pro X, Ableton Live 11+",
      "M1/M2/M3/M4 (ARM64 Native)",
      "4GB RAM minimum",
      "AU, VST3, AAX formats",
    ],
    demoUrl: "https://example.com/demo/crystal-compressor",
  },
  "crystal-reverb": {
    name: "Crystal Reverb",
    description: "รีเวิร์บเสียงธรรมชาติเหมือนอยู่ในห้องจริง",
    priceUSD: 79.99,
    features: ["Algorithmic & Convolution reverb", "12 reverb types", "EQ section", "Early reflections control"],
    systemRequirements: ["MacOS Ventura 13.0+", "M1/M2/M3/M4", "AU, VST3, AAX"],
    demoUrl: "https://example.com/demo/crystal-reverb",
  },
  // ... add more plugins
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
            <h1 className="text-4xl font-bold mb-2">{plugin.name}</h1>
            <p className="text-xl text-gray-300 mb-6">{plugin.description}</p>

            {/* Price & Buy */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <PriceDisplay usdPrice={plugin.priceUSD} />
              <div className="mt-6 space-y-3">
                <Link
                  href={`/checkout/${slug}`}
                  className="block text-center bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold py-4 rounded-xl text-lg"
                >
                  ซื้อเลย - รับ License ทันที
                </Link>
                <a
                  href={plugin.demoUrl}
                  target="_blank"
                  className="block text-center border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold py-4 rounded-xl"
                >
                  🎧 ดาวน์โหลดเวอร์ชันทดลอง
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                ฟีเจอร์หลัก
              </h2>
              <ul className="space-y-2">
                {plugin.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-cyan-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Demo & Requirements */}
          <div>
            {/* Demo Placeholder */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Demo</h2>
              <div className="aspect-video bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎚️</div>
                  <p className="text-gray-400">
                    Plugin Interface Preview
                  </p>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                ข้อกำหนดระบบ
              </h2>
              <ul className="space-y-3">
                {plugin.systemRequirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-gray-400 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🍎</div>
                  <div>
                    <div className="font-bold">Optimized for M4 Max</div>
                    <div className="text-sm text-gray-400">
                      รัน Native บน Mac Studio M4 Max
                      (เขียนด้วย JUCE + Xcode)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}