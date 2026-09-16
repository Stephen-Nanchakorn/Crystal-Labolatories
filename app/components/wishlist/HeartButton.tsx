// /app/components/wishlist/HeartButton.tsx
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
  const [animating, setAnimating] = useState(false);
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

  const handleClick = async () => {
    if (!user) {
      // ถ้ายังไม่ล็อกอิน ให้ไปหน้า login
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setAnimating(true);
    
    const result = await toggleWishlist(pluginSlug, {
      name: pluginName,
      price: pluginPrice,
      image_url: pluginImage
    });

    if (result.success) {
      setIsInWishlist(result.action === "added");
      
      // Show success message
      if (typeof window !== 'undefined') {
        const message = language === "th" 
          ? (result.action === "added" 
              ? `เพิ่ม "${pluginName}" ลงรายการโปรดแล้ว!` 
              : `นำ "${pluginName}" ออกจากรายการโปรดแล้ว`)
          : (result.action === "added" 
              ? `Added "${pluginName}" to wishlist!` 
              : `Removed "${pluginName}" from wishlist`);
        
        // สร้าง toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
        toast.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="text-xl">${result.action === "added" ? "❤️" : "🤍"}</span>
            <span>${message}</span>
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.classList.add('animate-slide-out');
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }
    }

    setTimeout(() => setAnimating(false), 500);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl"
  };

  if (loading) {
    return (
      <button
        className={`${sizeClasses[size]} bg-gray-800 rounded-full flex items-center justify-center opacity-50`}
        disabled
      >
        <span className="animate-pulse">❤️</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={animating}
      className={`
        ${sizeClasses[size]} 
        ${isInWishlist 
          ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' 
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-300'
        }
        border rounded-full flex items-center justify-center transition-all duration-300
        ${animating ? 'scale-110' : 'hover:scale-105'}
        ${showText ? 'px-4 py-2 w-auto gap-2' : ''}
      `}
      title={isInWishlist 
        ? (language === "th" ? "นำออกจากรายการโปรด" : "Remove from wishlist") 
        : (language === "th" ? "เพิ่มลงรายการโปรด" : "Add to wishlist")
      }
    >
      {animating ? (
        <span className="animate-ping">❤️</span>
      ) : isInWishlist ? (
        <>
          <span>❤️</span>
          {showText && (
            <span className="text-sm font-medium">
              {language === "th" ? "ในรายการโปรด" : "In Wishlist"}
            </span>
          )}
        </>
      ) : (
        <>
          <span>🤍</span>
          {showText && (
            <span className="text-sm font-medium">
              {language === "th" ? "เพิ่มลงรายการโปรด" : "Add to Wishlist"}
            </span>
          )}
        </>
      )}
    </button>
  );
}