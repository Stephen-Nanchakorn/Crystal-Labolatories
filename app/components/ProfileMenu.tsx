"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { language, setLanguage, currency, setCurrency, t } = useApp();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserAvatar(user.user_metadata?.avatar_url || "");
        setUserName(user.user_metadata?.full_name || "");
      }
    }
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (mounted) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mounted]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
        <span className="text-gray-500">👤</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all">
          {userAvatar ? (
            <Image src={userAvatar} alt="Profile" width={32} height={32} className="w-full h-full object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">👤</div>
          )}
        </div>
        {userName && <span className="hidden md:inline text-sm text-gray-300">{userName}</span>}
        <span className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 py-2">
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                {userAvatar ? (
                  <Image src={userAvatar} alt="Profile" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">👤</div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{userName || "ผู้ใช้"}</p>
                <Link href="/profile" className="text-xs text-cyan-400 hover:text-cyan-300" onClick={() => setIsOpen(false)}>
                  {t("profile.settings")}
                </Link>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">{t("profile.language")}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("th")}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${language === "th" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                🇹🇭 ไทย
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${language === "en" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          {/* Currency - ✅ ไม่ disable อีกต่อไป เปลี่ยนได้อิสระ */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">{t("profile.currency")}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency("THB")}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "THB" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                ฿ {t("common.thb")}
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "USD" ? "bg-cyan-400 text-black font-medium" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                $ {t("common.usd")}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>🚪</span>
            {t("profile.signout")}
          </button>
        </div>
      )}
    </div>
  );
}