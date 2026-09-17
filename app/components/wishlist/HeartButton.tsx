"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toggleWishlist, checkWishlistStatus } from "@/app/actions/wishlist";

interface HeartButtonProps {
  pluginSlug: string;
  pluginName: string;
  pluginPrice: number;
  pluginImage?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  language?: string;
}

// ==================== TOAST HELPER ====================
function showToast(message: string, icon: string) {
  const existing = document.getElementById("wishlist-toast");
  existing?.remove();

  const toast = document.createElement("div");
  toast.id = "wishlist-toast";
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur border border-gray-700 text-white px-5 py-3 rounded-full shadow-xl z-[100] flex items-center gap-2 text-sm transition-all duration-300 opacity-0 translate-y-3";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-3");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-3");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export default function HeartButton({
  pluginSlug,
  pluginName,
  pluginPrice,
  pluginImage,
  size = "md",
  showText = false,
  language = "en"
}: HeartButtonProps) {
  const supabase = createClient();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const result = await checkWishlistStatus(pluginSlug);
        setIsInWishlist(result.isInWishlist);
      }
      setLoading(false);
    }
    loadData();
  }, [pluginSlug, supabase.auth]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setPulse(true);
    setTimeout(() => setPulse(false), 400);

    const result = await toggleWishlist(pluginSlug, {
      name: pluginName,
      price: pluginPrice,
      image_url: pluginImage
    });

    if (result.success) {
      setIsInWishlist(result.action === "added");

      const message =
        result.action === "added"
          ? language === "th"
            ? `เพิ่ม "${pluginName}" ลงรายการโปรดแล้ว`
            : `Added "${pluginName}" to wishlist`
          : language === "th"
          ? `นำ "${pluginName}" ออกจากรายการโปรดแล้ว`
          : `Removed "${pluginName}" from wishlist`;

      showToast(message, result.action === "added" ? "❤️" : "🤍");
    }
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-base",
    md: "w-11 h-11 text-lg",
    lg: "w-14 h-14 text-2xl"
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-40`}>
        <span className="text-sm">♡</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        relative rounded-full backdrop-blur-md flex items-center justify-center
        transition-all duration-300 ease-out
        ${isInWishlist
          ? "bg-black/30 text-red-400/90"
          : "bg-black/20 text-white/50 hover:text-white/80 hover:bg-black/30"
        }
        ${pulse ? "scale-125" : "scale-100 hover:scale-110"}
        ${showText ? "px-4 py-2 w-auto gap-2" : ""}
      `}
      title={
        isInWishlist
          ? (language === "th" ? "นำออกจากรายการโปรด" : "Remove from wishlist")
          : (language === "th" ? "เพิ่มลงรายการโปรด" : "Add to wishlist")
      }
    >
      {/* Ripple/pulse effect ตอนกด */}
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></span>
      )}
      
      <span className={`relative transition-transform ${pulse ? "scale-90" : ""}`}>
        {isInWishlist ? "♥" : "♡"}
      </span>
      
      {showText && (
        <span className="relative text-sm font-medium">
          {isInWishlist
            ? (language === "th" ? "ในรายการโปรด" : "In Wishlist")
            : (language === "th" ? "เพิ่มลงรายการโปรด" : "Add to Wishlist")}
        </span>
      )}
    </button>
  );
}