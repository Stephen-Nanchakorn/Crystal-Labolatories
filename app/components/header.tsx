"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">CRYSTAL</span>
          <span className="text-cyan-400">LABS</span>
        </Link>

        {/* Navigation + Currency */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/plugins" className="text-gray-300 hover:text-white">
              Plugins
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white">
              Support
            </Link>
          </nav>

          {/* ✅ เพิ่ม Currency Toggle ตรงนี้ */}
          <div className="hidden md:flex items-center gap-2 border-l border-gray-700 pl-6">
            <button
              onClick={() => setCurrency("THB")}
              className={`px-3 py-1 text-sm rounded-full ${
                currency === "THB"
                  ? "bg-cyan-400 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              THB
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 text-sm rounded-full ${
                currency === "USD"
                  ? "bg-cyan-400 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              USD
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
            >
              👤
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}