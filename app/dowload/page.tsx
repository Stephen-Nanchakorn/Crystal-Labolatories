"use client";

import { useState } from "react";
import { useApp } from "@/app/context/AppContext";

export default function DownloadPage() {
  const { language } = useApp();
  const [os, setOs] = useState<"mac" | "windows">("mac");

  const downloadLinks = {
    mac: {
      version: "v2.1.4",
      size: "87.4 MB",
      requirements: "macOS 13.0+ (Ventura), Apple Silicon or Intel",
      link: "#",
    },
    windows: {
      version: "v2.1.4", 
      size: "92.8 MB",
      requirements: "Windows 10/11 (64-bit), 4GB RAM",
      link: "#",
    },
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">
          {language === "th" ? "ดาวน์โหลด Crystal Access" : "Download Crystal Access"}
        </h1>
        <p className="text-gray-400 text-center mb-10">
          {language === "th" 
            ? "แอพพลิเคชันเดสก์ท็อปสำหรับจัดการปลั๊กอินของคุณ" 
            : "Desktop application for managing your plugins"}
        </p>

        {/* OS Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setOs("mac")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${os === "mac" ? "bg-cyan-400 text-black" : "text-gray-300 hover:text-white"}`}
            >
              {language === "th" ? "สำหรับ macOS" : "For macOS"}
            </button>
            <button
              onClick={() => setOs("windows")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${os === "windows" ? "bg-cyan-400 text-black" : "text-gray-300 hover:text-white"}`}
            >
              {language === "th" ? "สำหรับ Windows" : "For Windows"}
            </button>
          </div>
        </div>

        {/* Download Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-bold mb-2">Crystal Access</h2>
            <p className="text-gray-400">
              {language === "th" 
                ? "ตัวจัดการปลั๊กอินแบบสแตนด์อโลน" 
                : "Standalone plugin manager"}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-400">{language === "th" ? "เวอร์ชัน" : "Version"}</span>
              <span className="font-mono">{downloadLinks[os].version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{language === "th" ? "ขนาดไฟล์" : "File Size"}</span>
              <span>{downloadLinks[os].size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{language === "th" ? "ความต้องการระบบ" : "System Requirements"}</span>
              <span className="text-right max-w-xs">{downloadLinks[os].requirements}</span>
            </div>
          </div>

          <a
            href={downloadLinks[os].link}
            className="block w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-lg text-center text-lg transition-colors mb-4"
          >
            {language === "th" ? "⬇️ ดาวน์โหลดตอนนี้" : "⬇️ Download Now"}
          </a>

          <p className="text-gray-500 text-sm text-center">
            {language === "th" 
              ? "ใช้งานฟรี • ไม่ต้องสมัครสมาชิก" 
              : "Free to use • No subscription required"}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-cyan-400 text-2xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">
              {language === "th" ? "ติดตั้งอัตโนมัติ" : "Automatic Installation"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "th" 
                ? "ดาวน์โหลดและติดตั้งปลั๊กอินด้วยคลิกเดียว" 
                : "Download and install plugins with one click"}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-cyan-400 text-2xl mb-3">🔄</div>
            <h3 className="font-semibold mb-2">
              {language === "th" ? "อัปเดตอัตโนมัติ" : "Auto Updates"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "th" 
                ? "รับการอัปเดตล่าสุดโดยอัตโนมัติ" 
                : "Get the latest updates automatically"}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-cyan-400 text-2xl mb-3">🔐</div>
            <h3 className="font-semibold mb-2">
              {language === "th" ? "จัดการลิขสิทธิ์" : "License Management"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "th" 
                ? "จัดการและสลับลิขสิทธิ์ระหว่างเครื่องได้ง่าย" 
                : "Easily manage and transfer licenses between devices"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}