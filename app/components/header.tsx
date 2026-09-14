"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import ProfileDropdown from "@/app/components/ProfileDropDown";

export default function Header() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:opacity-90">
          <span className="text-white">Crystal</span>{" "}
          <span className="text-cyan-400">Lab</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm ${pathname === "/" ? "text-white" : "text-gray-300 hover:text-white"}`}
            >
              {t("header.home")}
            </Link>
            <Link
              href="/plugins"
              className={`text-sm ${pathname.startsWith("/plugins") ? "text-white" : "text-gray-300 hover:text-white"}`}
            >
              {t("header.plugins")}
            </Link>
            <Link
              href="/pricing"
              className={`text-sm ${pathname === "/pricing" ? "text-white" : "text-gray-300 hover:text-white"}`}
            >
              {t("header.pricing")}
            </Link>
            <Link
              href="/support"
              className={`text-sm ${pathname === "/support" ? "text-white" : "text-gray-300 hover:text-white"}`}
            >
              {t("header.support")}
            </Link>
          </nav>

          {/* ✅ ใช้ ProfileDropdown จริงๆ */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}