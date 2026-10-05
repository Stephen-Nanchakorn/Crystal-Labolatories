"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";

export default function LanguageCurrencySwitcher() {
  const { language, setLanguage, currency, setCurrency } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: "th" | "en", curr: "THB" | "USD") => {
    setLanguage(lang);
    setCurrency(curr);
    setIsOpen(false);
  };

  const isThai = language === "th" || currency === "THB";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-sm text-gray-200 transition-colors"
      >
        <span>{isThai ? "🇹🇭 ไทย / ฿" : "🇺🇸 EN / $"}</span>
        <span className="text-xs text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-1 z-50">
          <button
            onClick={() => handleSelect("th", "THB")}
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-800 transition-colors ${
              isThai ? "text-cyan-400 font-medium" : "text-gray-300"
            }`}
          >
            <span>🇹🇭 ไทย / ฿</span>
            {isThai && <span>✓</span>}
          </button>
          <button
            onClick={() => handleSelect("en", "USD")}
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-800 transition-colors ${
              !isThai ? "text-cyan-400 font-medium" : "text-gray-300"
            }`}
          >
            <span>🇺🇸 EN / $</span>
            {!isThai && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}