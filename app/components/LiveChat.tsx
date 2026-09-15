"use client";

import { usePathname } from "next/navigation";

export default function LiveChat() {
  const pathname = usePathname();

  // ✅ แสดงเฉพาะหน้า /support เท่านั้น
  if (pathname !== "/support") {
    return null;
  }

  return (
    <button
      className="fixed bottom-6 right-6 bg-cyan-400 hover:bg-cyan-500 text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
      aria-label="Live Chat"
    >
      <span className="text-2xl">💬</span>
    </button>
  );
}