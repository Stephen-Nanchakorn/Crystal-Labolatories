"use client";

import Link from "next/link";
import LanguageCurrencySwitcher from "@/app/components/LanguageCurrencySwitcher";
import ProfileMenu from "@/app/components/ProfileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-white">
          Crystal Lab
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/plugins" className="text-gray-300 hover:text-white transition-colors">
            Plugins
          </Link>
          <Link href="/refer" className="text-gray-300 hover:text-white transition-colors">
            Refer & Earn
          </Link>
        </nav>

        {/* RIGHT SIDE: Language/Currency + Profile */}
        <div className="flex items-center gap-3">
          <LanguageCurrencySwitcher />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}