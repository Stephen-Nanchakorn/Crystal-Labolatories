import { plugins } from "../../data/plugins";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function generateStaticParams() {
  return plugins.map((plugin) => ({ slug: plugin.slug }));
}

export default async function PluginDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = plugins.find((p) => p.slug === slug);

  if (!plugin) return notFound();

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <Link href="/#plugins" className="text-cyan-400 hover:underline text-sm">
          ← กลับไปหน้าปลั๊กอินทั้งหมด
        </Link>

        <h1 className="text-3xl sm:text-5xl font-extrabold mt-6 mb-4">
          {plugin.name}
        </h1>

        <p className="text-gray-400 text-base sm:text-lg mb-6">
          {plugin.desc}
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
          <p className="text-gray-300 leading-relaxed">{plugin.detail}</p>
        </div>

        <div className="flex items-center justify-between bg-gray-900 border border-cyan-400/50 rounded-2xl p-6">
          <span className="text-xl sm:text-2xl font-bold text-cyan-400">
            {plugin.price}
          </span>
          <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition">
            ซื้อเลย
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}