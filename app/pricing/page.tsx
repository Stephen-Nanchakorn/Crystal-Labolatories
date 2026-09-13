import Link from "next/link";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    description: "ปรับจูนเสียงฟรี สำหรับ Guitar, Bass, Keyboard",
    priceUSD: 0,
    isFree: true,
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    description: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง",
    priceUSD: 29.99,
    isFree: false,
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    description: "Graphic EQ 7-Band พร้อม Gate และ Compressor",
    priceUSD: 19.99,
    isFree: false,
  },
];

const EXCHANGE_RATE = 35; // 1 USD = 35 THB (Fixed)

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-16">
          Pricing <span className="text-cyan-400">แผนราคา</span>
        </h1>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plugins.map((plugin) => {
            const thbPrice = Math.round(plugin.priceUSD * EXCHANGE_RATE);

            return (
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
                      ราคา
                    </span>
                  </div>

                  {plugin.isFree ? (
                    <div className="text-4xl font-bold text-green-400">
                      FREE
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-white">
                        ฿{thbPrice.toLocaleString("th-TH")}
                        <span className="text-lg text-gray-400 ml-1">
                          บาท
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        ≈ ${plugin.priceUSD} USD (คงที่ {EXCHANGE_RATE} บาท/1
                        USD)
                      </div>
                    </>
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
            );
          })}
        </div>
      </div>
    </main>
  );
}