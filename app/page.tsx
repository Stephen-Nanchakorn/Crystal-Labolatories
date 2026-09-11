import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Plugins from "./components/Plugins";
import Footer from "./components/Footer";

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
        <button className="mt-6 bg-cyan-400 text-black px-6 py-3 rounded-full">
          เลือกซื้อปลั๊กอิน
        </button>
      </section>

      {/* Plugin Cards Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">ปลั๊กอินของเรา</h2>
        {/* ... การ์ด Plugin ... */}
      </section>
    </>
  );
}