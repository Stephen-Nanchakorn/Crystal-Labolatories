"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";

export default function Footer() {
  const { language } = useApp();

  const currentYear = new Date().getFullYear();

  // Social Media links
  const socialLinks = [
    {
      name: "Instagram",
      icon: "/social/instagram.svg",
      url: "https://instagram.com/crystallabofficial",
      alt: "Instagram",
    },
    {
      name: "Twitter",
      icon: "/social/twitter.svg", 
      url: "https://twitter.com/crystallab",
      alt: "Twitter",
    },
    {
      name: "YouTube",
      icon: "/social/youtube.svg",
      url: "https://youtube.com/c/@crystallabofficial",
      alt: "YouTube",
    },
    {
      name: "Facebook",
      icon: "/social/facebook.svg",
      url: "https://facebook.com/crystallabofficial",
      alt: "Facebook",
    },
    {
      name: "Discord",
      icon: "/social/discord.svg",
      url: "https://discord.gg/crystallab",
      alt: "Discord",
    },
    {
      name: "GitHub",
      icon: "/social/github.svg",
      url: "https://github.com/crystal-lab",
      alt: "GitHub",
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Logo & Tagline */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">🎧</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold">
                <span className="text-white">Crystal</span>
                <span className="text-cyan-400">Lab</span>
              </h2>
              <p className="text-gray-400 text-sm">
                {language === "th" 
                  ? "เสียงระดับสตูดิโอ สำหรับโปรดิวเซอร์รุ่นใหม่" 
                  : "Studio-grade audio tools for next-generation producers"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* 1.1 Popular Plugins */}
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

          {/* 1.2 Popular Pages */}
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
                <Link href="/refer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "👥 ชวนเพื่อน (รับส่วนลด)" : "👥 Refer a Friend (Get Discount)"}
                </Link>
              </li>
            </ul>
          </div>

          {/* 1.3 Useful Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "ลิงก์สำคัญ" : "Useful Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "👤 บัญชีของฉัน" : "👤 My Account"}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  {language === "th" ? "   ↳ ยังไม่มีบัญชี? สมัครเลย" : "   ↳ No account? Sign up"}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {language === "th" ? "🛟 ศูนย์ช่วยเหลือ" : "🛟 Support Center"}
                </Link>
              </li>
            </ul>
          </div>

          {/* 1.4 About Us */}
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
                <Link href="/eula" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  📄 EULA (End User License Agreement)
                </Link>
              </li>
            </ul>
          </div>

          {/* 1.7 Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-300">
              {language === "th" ? "ติดตามเรา" : "Follow Us"}
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors"
                  title={social.name}
                >
                  <span className="text-xl">
                    {social.name === "Instagram" && "📷"}
                    {social.name === "Twitter" && "🐦"}
                    {social.name === "YouTube" && "▶️"}
                    {social.name === "Facebook" && "👍"}
                    {social.name === "Discord" && "💬"}
                    {social.name === "GitHub" && "💻"}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              {language === "th" 
                ? "ติดตามข่าวสารและอัปเดตล่าสุด" 
                : "Stay updated with news and releases"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 1.6 Copyright */}
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Crystal Labolatories. {language === "th" ? "สงวนลิขสิทธิ์ทุกประการ" : "All rights reserved."}
          </div>

          {/* Additional Legal Links */}
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