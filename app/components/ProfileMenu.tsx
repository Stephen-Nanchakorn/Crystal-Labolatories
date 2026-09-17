"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { getUserBalance } from "@/app/actions/credit";
import ProfileAvatar from "@/app/components/ProfileAvatar";

export default function ProfileMenu() {
  const { language } = useApp();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // ✅ กำหนด state สำหรับ avatarUrl

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // โหลดข้อมูล user จากตาราง users
        const { data: userData } = await supabase
          .from("users")
          .select("balance, avatar_url, preferred_language, preferred_currency")
          .eq("id", user.id)
          .single();
        
        if (userData) {
          setBalance(userData.balance || 0);
          setAvatarUrl(userData.avatar_url); // ✅ ตั้งค่า avatarUrl จาก database
        } else {
          // ถ้ายังไม่มีข้อมูลใน users table
          setBalance(0);
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
        <ProfileAvatar
          userId={user.id}
          avatarUrl={avatarUrl} // ✅ ใช้ avatarUrl ที่มาจาก state
          email={user.email || ""}
          size="sm"
        />
        <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
        <span className="text-gray-400 text-sm">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <ProfileAvatar
                userId={user.id}
                avatarUrl={avatarUrl}
                email={user.email || ""}
                size="md"
                editable={true}
                onUploadSuccess={(newUrl) => setAvatarUrl(newUrl)}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {user.email}
                </div>
                <div className="text-sm text-gray-400">
                  {language === "th" ? "สมาชิก Crystal Lab" : "Crystal Lab Member"}
                </div>
              </div>
            </div>
            
            {/* Balance Display */}
            <div className="p-3 bg-gray-800 rounded-lg">
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

          {/* Settings & Logout */}
          <div className="p-2">
            <Link
              href="/profile/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
            >
              <span>⚙️</span>
              <span>{language === "th" ? "ตั้งค่า" : "Settings"}</span>
            </Link>
            
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