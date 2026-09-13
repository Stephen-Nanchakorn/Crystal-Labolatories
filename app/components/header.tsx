"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/app/hooks/useCurrency"; // ✅ ใช้ hook

export default function Header() {
  const { currency, setCurrency, mounted } = useCurrency(); // ✅ ดึงมาจาก hook
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserAvatar(user.user_metadata?.avatar_url || "");
        setUserName(user.user_metadata?.full_name || "");
      }
    }
    getUser();
  }, [supabase.auth]);

  const showCurrencyToggle =
    pathname === "/pricing" || pathname.startsWith("/plugins");

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-90">
          <span className="text-white">CRYSTAL</span>
          <span className="text-cyan-400">LABS</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm ${pathname === "/" ? "text-white" : "text-gray-300 hover:text-white"}`}>หน้าแรก</Link>
            <Link href="/plugins" className={`text-sm ${pathname.startsWith("/plugins") ? "text-white" : "text-gray-300 hover:text-white"}`}>ปลั๊กอิน</Link>
            <Link href="/pricing" className={`text-sm ${pathname === "/pricing" ? "text-white" : "text-gray-300 hover:text-white"}`}>ราคา</Link>
            <Link href="/support" className="text-sm text-gray-300 hover:text-white">ช่วยเหลือ</Link>
          </nav>

          {showCurrencyToggle && mounted && (
            <div className="hidden md:flex items-center gap-2 border-l border-gray-700 pl-6">
              <button
                onClick={() => setCurrency("THB")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${currency === "THB" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300"}`}
              >
                THB
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${currency === "USD" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300"}`}
              >
                USD
              </button>
            </div>
          )}

          <Link href="/profile" className="group relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden border-2 border-transparent group-hover:border-cyan-400 transition-all">
              {userAvatar ? (
                <Image src={userAvatar} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">👤</div>
              )}
            </div>
            {userName && <span className="hidden md:inline text-sm text-gray-300 group-hover:text-white">{userName}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}