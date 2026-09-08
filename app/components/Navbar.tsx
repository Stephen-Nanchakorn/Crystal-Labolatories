"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        <span className="text-white font-extrabold text-xl">CRYSTAL</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          {/* เมนูนำทาง (ซ้าย-กลาง) */}
          <a href="/" className="hover:text-white transition">หน้าแรก</a>
          <a href="/plugins" className="hover:text-white transition">ปลั๊กอิน</a>

          {/* ปุ่ม Login/Signup (ขวาสุด) */}
          <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
            <a href="/login" className="text-gray-300 hover:text-white">
              เข้าสู่ระบบ
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition"
            >
              สมัครสมาชิก
            </a>
          </div>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? "×" : "="}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-gray-300">
          <a href="/" onClick={() => setOpen(false)} className="hover:text-white">หน้าแรก</a>
          <a href="/plugins" onClick={() => setOpen(false)} className="hover:text-white">ปลั๊กอิน</a>
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
            <a href="/login" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
              เข้าสู่ระบบ
            </a>
            <a
              href="/signup"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-center"
            >
              สมัครสมาชิก
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}