"use client";

import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import HeartButton from "@/app/components/wishlist/HeartButton";

export interface PluginCardProps {
  slug: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  image_url?: string;
  category?: string;
  isFeatured?: boolean;
  is_featured?: boolean;
  discountPercent?: number;
  discount_percent?: number;
  isFree?: boolean;
  is_free?: boolean;
  [key: string]: any;
}

// ตารางราคาคงที่ตรงตามที่คุณกำหนด
const PLUGIN_PRICES: Record<string, { thb: number; usd: number; isFree?: boolean }> = {
  "stem-splitter": { thb: 3249, usd: 99 },
  "analog-eq": { thb: 1949, usd: 59 },
  "drop-tune": { thb: 0, usd: 0, isFree: true },
};

export default function PluginCard(props: PluginCardProps) {
  const { language, currency: appCurrency } = useApp();

  const slug = (props.slug || props.id || "").toLowerCase();
  const name = props.name;
  const description = props.description || "";
  const imageUrl = props.imageUrl || props.image_url;
  const category = props.category;
  const isFeatured = props.isFeatured || props.is_featured || false;
  const discountPercent = props.discountPercent || props.discount_percent || 0;

  // ตรวจสอบสถานะ THB / USD
  const isTHB = (props.currency || appCurrency) === "THB" || language === "th";

  // ดึงราคาที่แมปไว้ตาม slug
  const matchedPrice = PLUGIN_PRICES[slug];
  const isFree = props.isFree || props.is_free || matchedPrice?.isFree || false;

  let displayPrice = "";
  if (isFree) {
    displayPrice = language === "th" ? "ฟรี" : "FREE";
  } else if (isTHB) {
    const amount = matchedPrice?.thb ?? props.price_thb ?? props.price_th ?? 0;
    displayPrice = `฿${amount.toLocaleString()}`;
  } else {
    const amount = matchedPrice?.usd ?? props.price_usd ?? props.price ?? 0;
    displayPrice = `$${amount.toFixed(2)}`;
  }

  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 ${
        isFeatured ? "border-cyan-500/50" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-800 to-black overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🎧</span>
          </div>
        )}

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

        <div className="absolute top-3 right-3">
          <HeartButton
            pluginSlug={slug}
            pluginName={name}
            pluginPrice={matchedPrice?.usd || props.price || 0}
            pluginImage={imageUrl}
            size="sm"
            language={language}
          />
        </div>

        {category && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-white line-clamp-1">{name}</h3>
          <div className="text-xl font-bold text-cyan-400 whitespace-nowrap">
            {displayPrice}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

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