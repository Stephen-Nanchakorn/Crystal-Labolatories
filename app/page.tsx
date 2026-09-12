import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Plugins from "./components/Plugins";
import Footer from "./components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-6xl font-bold">
          CRYSTAL <span className="text-cyan-400">PLUGINS</span>
        </h1>
        <p className="text-gray-400 mt-4">
          ปลั๊กอินเสียงคุณภาพสตูดิโอ สำหรับโปรดิวเซอร์ยุคใหม่
        </p>
        <Link

          href="/plugins"

          className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-3 rounded-full transition-colors"

        >

          เลือกซื้อปลั๊กอิน

        </Link>
      </section>

      {/* Plugin Cards Section */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">ปลั๊กอินของเรา</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {

              slug: "drop-tune",

              name: "Drop-Tune",

              desc: "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",

            },

            {

              slug: "stem-splitter",

              name: "Stem Splitter",

              desc: "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",

            },

            {

              slug: "analog-eq",

              name: "Analog EQ",

              desc: "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",

            },
          ].map((plugin) => (
            <div
              key={plugin.slug}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-colors"
            >
              <h3 className="text-xl font-bold mb-3">{plugin.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plugin.desc}</p>
              <Link
                href={`/plugins/${plugin.slug}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
              >
                ดูรายละเอียด →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}