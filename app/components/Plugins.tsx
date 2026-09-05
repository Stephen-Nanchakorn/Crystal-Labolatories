"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { plugins } from "../data/plugins";

export default function Plugins() {
  return (
    <section id="plugins" className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 sm:mb-14"
      >
        ปลั๊กอินของเรา
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {plugins.map((plugin, index) => (
          <motion.div
            key={plugin.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Link
              href={`/plugins/${plugin.slug}`}
              className="block bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-cyan-400 transition h-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {plugin.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {plugin.desc}
              </p>
              <span className="inline-block mt-4 text-cyan-400 text-sm font-semibold">
                ดูรายละเอียด →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}