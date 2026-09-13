import Link from "next/link";

const plugins = [
  {
    slug: "drop-tune",
    name: "Drop-Tune",
    desc: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
    icon: "🎸",
  },
  {
    slug: "stem-splitter",
    name: "Stem Splitter",
    desc: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
    icon: "🧬",
  },
  {
    slug: "analog-eq",
    name: "Analog EQ",
    desc: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
    icon: "🎛️",
  },
];

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 md:py-36">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          CRYSTAL <span className="text-cyan-400">PLUGINS</span>
        </h1>
        <p className="text-gray-400 mt-5 max-w-xl mx-auto">
          ปลั๊กอินเสียงคุณภาพสตูดิโอ สำหรับโปรดิวเซอร์ยุคใหม่
        </p>
        <Link
          href="/plugins"
          className="mt-8 inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-3 rounded-full transition-colors"
        >
          เลือกซื้อปลั๊กอิน
        </Link>
      </section>

      {/* Plugins Section */}
      <section className="px-6 py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            ปลั๊กอินของเรา
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plugins.map((plugin) => (
              <div
                key={plugin.slug}
                className="flex flex-col justify-between bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full hover:border-cyan-500 transition-colors"
              >
                <div>
                  <div className="text-4xl mb-4">{plugin.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{plugin.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {plugin.desc}
                  </p>
                </div>

                <Link
                  href={`/plugins/${plugin.slug}`}
                  className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 mt-auto"
                >
                  ดูรายละเอียด →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}