"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import HeartButton from "@/app/components/wishlist/HeartButton";

// ==================== TYPES ====================
interface PluginCardProps {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  category?: string;
  isFeatured?: boolean;
  discountPercent?: number;
  isFree?: boolean;
}

// ==================== MAIN COMPONENT ====================
export default function PluginCard({
  slug,
  name,
  description,
  price,
  currency = "USD",
  imageUrl = "/plugin-placeholder.jpg",
  category,
  isFeatured = false,
  discountPercent = 0,
  isFree = false
}: PluginCardProps) {
  const { language } = useApp();
  
  // ==================== FUNCTIONS ====================
  function getCurrencySymbol(curr: string): string {
    return curr === "THB" ? "฿" : "$";
  }

  function formatPrice(prc: number, curr: string): string {
    const symbol = getCurrencySymbol(curr);
    return isFree 
      ? (language === "th" ? "ฟรี" : "FREE")
      : `${symbol}${prc.toFixed(curr === "THB" ? 0 : 2)}`;
  }

  // ==================== RENDER ====================
  const displayPrice = formatPrice(price, currency);

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 ${isFeatured ? 'border-cyan-500/50' : ''}`}>
      {/* IMAGE CONTAINER */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover opacity-70 hover:opacity-90 transition-opacity"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🎧</span>
          </div>
        )}
        
        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFeatured && (
            <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {language === "th" ? "แนะนำ" : "FEATURED"}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {isFree && (
            <span className="bg-blue-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {language === "th" ? "ฟรี" : "FREE"}
            </span>
          )}
        </div>
        
        {/* HEART BUTTON */}
        <div className="absolute top-3 right-3">
          <HeartButton
            pluginSlug={slug}
            pluginName={name}
            pluginPrice={price}
            pluginImage={imageUrl}
            size="sm"
            language={language}
          />
        </div>
        
        {/* CATEGORY */}
        {category && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        )}
      </div>
      
      {/* CONTENT */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {name}
          </h3>
          <div className="text-xl font-bold text-cyan-400 whitespace-nowrap">
            {displayPrice}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* ACTIONS */}
        <div className="flex gap-3">
          <Link
            href={`/plugins/${slug}`}
            className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 rounded-lg text-center transition-colors text-sm"
          >
            {language === "th" ? "ดูรายละเอียด" : "View Details"}
          </Link>
          <button className="px-4 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
            {language === "th" ? "ทดลองใช้" : "Try Demo"}
          </button>
        </div>
      </div>
    </div>
  );
}