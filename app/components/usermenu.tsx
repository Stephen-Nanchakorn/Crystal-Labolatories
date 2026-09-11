"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu({ 
  displayName 
}: { 
  displayName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const userInitial = displayName[0]?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-black font-bold">
            {userInitial}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs text-gray-400">ยินดีต้อนรับ</div>
            <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
              {displayName}
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-800">
            <div className="font-semibold text-white truncate">{displayName}</div>
            <div className="text-xs text-gray-400 truncate">ผู้ใช้งานระดับ Premium</div>
          </div>
          
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">👤</span>
            <span>บัญชีของฉัน</span>
          </a>
          
          <a
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">⚙️</span>
            <span>ตั้งค่าบัญชี</span>
          </a>
          
          <a
            href="/purchases"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">📦</span>
            <span>การซื้อของฉัน</span>
          </a>

          <div className="border-t border-gray-800 mt-2 pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}