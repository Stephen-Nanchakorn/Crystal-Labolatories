"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight"
      >
        CRYSTAL <span className="text-cyan-400">PLUGINS</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 max-w-xs sm:max-w-md md:max-w-2xl"
      >
        ปลั๊กอินเสียงคุณภาพสตูดิโอ สำหรับโปรดิวเซอร์ยุคใหม่
      </motion.p>

      <motion.a
        href="#plugins"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 px-6 py-3 sm:px-8 sm:py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition text-sm sm:text-base"
      >
        เลือกซื้อปลั๊กอิน
      </motion.a>
    </section>
  );
}