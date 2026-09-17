"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";

export default function LanguageCurrencySwitcher() {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLanguage(lang: "th" | "en") {
    setLanguage(lang);
    setIsOpen(false);
  }

  const currentFlag = language === "th" ? "🇹🇭" : "🇺🇸";
  const currentLabel = language === "th" ? "ไทย / ฿" : "EN / $";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-full px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
      >
        <span>{currentFlag}</span>
        <span className="hidden sm:inline">{currentLabel}</span>
        <span className="text-gray-500 text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => selectLanguage("th")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${language === "th" ? "bg-gray-800/60" : ""}`}
          >
            <span>🇹🇭</span>
            <div>
              <div className="text-sm font-medium">ไทย</div>
              <div className="text-xs text-gray-500">฿ บาท</div>
            </div>
            {language === "th" && <span className="ml-auto text-cyan-400">✓</span>}
          </button>
          
          <button
            onClick={() => selectLanguage("en")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${language === "en" ? "bg-gray-800/60" : ""}`}
          >
            <span>🇺🇸</span>
            <div>
              <div className="text-sm font-medium">English</div>
              <div className="text-xs text-gray-500">$ USD</div>
            </div>
            {language === "en" && <span className="ml-auto text-cyan-400">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}