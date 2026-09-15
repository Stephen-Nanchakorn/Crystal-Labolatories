"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";

export default function Footer() {
  const { language } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const supabase = createClient();

  // ✅ เช็คสถานะล็อกอินตอนโหลด component
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkAuth();
  }, [supabase.auth]);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Instagram", url: "https://instagram.com/crystallabofficial", icon: "📷" },
    { name: "Twitter", url: "https://twitter.com/crystallab", icon: "🐦" },
    { name: "YouTube", url: "https://youtube.com/c/@crystallabofficial", icon: "▶️" },
    { name: "Facebook", url: "https://facebook.com/crystallabofficial", icon: "👍" },
    { name: "Discord", url: "https://discord.gg/crystallab", icon: "💬" },
    { name: "GitHub", url: "https://github.com/crystal-lab", icon: "💻" },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ❌ ลบ Logo & Tagline block ออกทั้งหมดแล้ว (ข้อ 2) */}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Popular Plugins */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "ปลั๊กอินยอดนิยม" : "Popular Plugins"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/plugins/stem-splitter" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  🧬 Stem Splitter
                </Link>
              </li>
              <li>
                <Link href="/plugins/analog-eq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  🎛️ Analog EQ
                </Link>
              </li>
              <li>
                <Link href="/plugins/drop-tune" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  🎸 Drop-Tune
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Pages */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "หน้าที่นิยม" : "Popular Pages"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/plugins" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "📦 ปลั๊กอินทั้งหมด" : "📦 All Plugins"}
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "⬇️ ดาวน์โหลด Crystal Access" : "⬇️ Download Crystal Access"}
                </Link>
              </li>
              <li>
                {/* ✅ ข้อ 1: ลบ (รับส่วนลด) ออก */}
                <Link href="/refer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "👥 ชวนเพื่อน" : "👥 Refer a Friend"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "ลิงก์สำคัญ" : "Useful Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                {/* ✅ ข้อ 3: Smart link เช็คสถานะล็อกอิน ไม่มีบรรทัด "ยังไม่มีบัญชี" อีกแล้ว */}
                <Link
                  href={isLoggedIn ? "/profile" : "/login"}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {language === "th" ? "👤 บัญชีของฉัน" : "👤 My Account"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "🛟 ศูนย์ช่วยเหลือ" : "🛟 Support Center"}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "เกี่ยวกับเรา" : "About Us"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "📞 ติดต่อเรา" : "📞 Contact Us"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "🏢 เกี่ยวกับ Crystal Lab" : "🏢 About Crystal Lab"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  {language === "th" ? "⚖️ ข้อกำหนดการใช้งาน" : "⚖️ Terms of Use"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  {language === "th" ? "🔒 นโยบายความเป็นส่วนตัว" : "🔒 Privacy Notice"}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  {language === "th" ? "🍪 นโยบายคุกกี้" : "🍪 Cookie Notice"}
                </Link>
              </li>
              <li>
                {/* ✅ ข้อ 4: ลบคำอธิบายออก เหลือแค่ EULA */}
                <Link href="/eula" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  📄 EULA
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "ติดตามเรา" : "Follow Us"}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors"
                  title={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
            {/* ❌ ข้อ 5: ลบ "ติดตามข่าวสารและอัปเดตล่าสุด" ออกแล้ว */}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Crystal Labolatories. {language === "th" ? "สงวนลิขสิทธิ์ทุกประการ" : "All rights reserved."}
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm">
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              {language === "th" ? "ข้อกำหนด" : "Terms"}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              {language === "th" ? "ความเป็นส่วนตัว" : "Privacy"}
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-cyan-400 transition-colors">
              {language === "th" ? "คุกกี้" : "Cookies"}
            </Link>
            <span>•</span>
            <Link href="/eula" className="hover:text-cyan-400 transition-colors">
              EULA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}