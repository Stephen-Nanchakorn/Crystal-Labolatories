import Link from "next/link";

// Mock data - ต่อไปจะดึงจาก Supabase
const plugins = [
  {
    id: "crystal-compressor",
    name: "Crystal Compressor",
    description: "คอนเพรสเซอร์เสียงที่แม่นยำระดับสตูดิโอ",
    priceUSD: 49.99,
    image: "/api/placeholder/400/300",
  },
  {
    id: "crystal-reverb",
    name: "Crystal Reverb",
    description: "รีเวิร์บเสียงธรรมชาติเหมือนห้องจริง",
    priceUSD: 79.99,
    image: "/api/placeholder/400/300",
  },
  {
    id: "crystal-eq",
    name: "Crystal EQ",
    description: "อีควอไลเซอร์ 16 แบนด์แบบพาราเมตริก",
    priceUSD: 59.99,
    image: "/api/placeholder/400/300",
  },
  {
    id: "crystal-bundle",
    name: "Complete Bundle",
    description: "ทุกปลั๊กอินในราคาพิเศษ",
    priceUSD: 149.99,
    image: "/api/placeholder/400/300",
  },
];

export default function PluginsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">CRYSTAL</span>{" "}
            <span className="text-cyan-400">PLUGINS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ สำหรับโปรดิวเซอร์สมัยใหม่
            ผลิตบน Mac Studio M4 Max เพื่อประสิทธิภาพสูงสุด
          </p>
        </div>

        {/* Plugin Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plugins.map((plugin) => (
            <Link
              key={plugin.id}
              href={`/plugins/${plugin.id}`}
              className="group block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500 transition-all hover:scale-[1.02]"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-5xl">🎛️</div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{plugin.name}</h3>
                  <div className="text-cyan-400 font-bold">
                    ${plugin.priceUSD}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {plugin.description}
                </p>
                <div className="text-sm text-gray-500">
                  • ใช้งานกับ Pro Tools, Logic, Ableton
                  <br />• MacOS Ventura ขึ้นไป
                  <br />• ARM64 Native (M4 Max Optimized)
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <div className="bg-cyan-400 text-black font-bold py-2 rounded-lg text-center group-hover:bg-cyan-500 transition-colors">
                  ดูรายละเอียดและทดลอง
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}