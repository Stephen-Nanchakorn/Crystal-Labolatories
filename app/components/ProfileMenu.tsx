"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { getUserBalance } from "@/app/actions/credit";

export default function ProfileMenu() {
  const { language } = useApp();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // โหลด balance
        const result = await getUserBalance();
        if (result.success && result.data) {
          setBalance(result.data.balance);
        }
      }
    }
    loadUserData();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
      >
        <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
          <span className="font-bold text-black">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="font-semibold text-white truncate">
              {user.email}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {language === "th" ? "สมาชิก Crystal Lab" : "Crystal Lab Member"}
            </div>
            
            {/* ✅ Balance Display */}
            <div className="mt-3 p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {language === "th" ? "เครดิต" : "Credits"}
                </span>
                <span className="text-cyan-400 font-bold">
                  {language === "th" ? "฿" : "$"}{balance.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === "th" 
                  ? "ใช้ลดราคาได้ทันที" 
                  : "Use for instant discounts"}
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>👤</span>
              <span>{language === "th" ? "โปรไฟล์ของฉัน" : "My Profile"}</span>
            </Link>
            
            <Link
              href="/profile/balance"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>💰</span>
              <span>{language === "th" ? "เครดิตของฉัน" : "My Credits"}</span>
            </Link>
            
            <Link
              href="/profile/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>❤️</span>
              <span>{language === "th" ? "รายการโปรด" : "Wishlist"}</span>
            </Link>
            
            <Link
              href="/profile/invoices"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>🧾</span>
              <span>{language === "th" ? "ใบเสร็จของฉัน" : "My Invoices"}</span>
            </Link>
            
            <Link
              href="/refer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>👥</span>
              <span>{language === "th" ? "ชวนเพื่อนรับเครดิต" : "Refer & Earn"}</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800"></div>

          {/* Sign Out */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
            >
              <span>🚪</span>
              <span>{language === "th" ? "ออกจากระบบ" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}