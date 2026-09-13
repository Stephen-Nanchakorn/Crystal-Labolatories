"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");
  const pathname = usePathname();

  // ✅ แสดง Currency Toggle เฉพาะหน้า /plugins, /pricing และหน้ารายละเอียดปลั๊กอิน
  const showCurrencyToggle =
    pathname === "/pricing" || pathname.startsWith("/plugins");

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
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white">
              หน้าแรก
            </Link>
            <Link href="/plugins" className="text-gray-300 hover:text-white">
              ปลั๊กอิน
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">
              ราคา
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white">
              ช่วยเหลือ
            </Link>
          </nav>

          {/* ✅ แสดง Currency Toggle แบบมีเงื่อนไข */}
          {showCurrencyToggle && (
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
          )}

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