"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        <span className="text-white font-extrabold text-xl">CRYSTAL</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-300">
          // ใน Navbar.tsx (แบบเดิมที่ไม่มีระบบเช็ค session)
          <div className="flex items-center gap-4">
            <a href="/login" className="text-gray-300 hover:text-white">
              เข้าสู่ระบบ
            </a>
            <a href="/signup" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg">
              สมัครสมาชิก
            </a>
          </div>

          <a href="#" className="hover:text-white transition">หน้าแรก</a>
          <a href="#plugins" className="hover:text-white transition">ปลั๊กอิน</a>
          <a href="#" className="hover:text-white transition">เกี่ยวกับเรา</a>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-gray-300">
          <a href="#" onClick={() => setOpen(false)} className="hover:text-white">หน้าแรก</a>
          <a href="#plugins" onClick={() => setOpen(false)} className="hover:text-white">ปลั๊กอิน</a>
          <a href="#" onClick={() => setOpen(false)} className="hover:text-white">เกี่ยวกับเรา</a>
        </div>
      )}
    </nav>
  );
}