"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import PluginCard from "@/app/components/plugins/PluginCard";

interface Plugin {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  is_free?: boolean;
  is_featured?: boolean;
  discount_percent?: number;
  [key: string]: any;
}

export default function PluginsPage() {
  const { language, currency } = useApp();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [quickFilter, setQuickFilter] = useState<string>("all");

  const supabase = createClient();

  useEffect(() => {
    async function fetchPlugins() {
      try {
        setLoading(true);
        let query = supabase.from("plugins").select("*");

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        // ค้นหาเฉพาะคำที่ "ขึ้นต้นด้วย" ตัวอักษรที่พิมพ์ (ตัด % ข้างหน้าออก)
        if (searchTerm.trim()) {
          const term = searchTerm.trim();
          query = query.or(`name.ilike.${term}%,slug.ilike.${term}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        const pluginsData = (data as Plugin[]) || [];
        setPlugins(pluginsData);

        // ดึงรายการ Categories เฉพาะตอนเริ่มต้น
        if (pluginsData.length > 0 && categories.length === 0) {
          const uniqueCats = Array.from(
            new Set(
              pluginsData
                .map((p) => p.category)
                .filter((cat): cat is string => Boolean(cat))
            )
          );
          setCategories(uniqueCats);
        }
      } catch (err) {
        console.error("Error fetching plugins:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlugins();
  }, [selectedCategory, searchTerm]);

  // คำนวณการแสดงผลปลั๊กอินตาม Quick Filter และค้นหาที่ขึ้นต้นด้วยคำที่พิมพ์
  const displayedPlugins = useMemo(() => {
    let result = [...plugins];

    // ค้นหาเฉพาะที่ "ขึ้นต้นด้วย" คำค้นหา (Starts with)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().startsWith(term) ||
          p.slug?.toLowerCase().startsWith(term)
      );
    }

    // กรองตาม Quick Filter
    if (quickFilter === "free") {
      return result.filter((p) => p.is_free || p.price === 0);
    }
    if (quickFilter === "featured") {
      return []; // แนะนำ: ไม่พบปลั๊กอิน
    }
    if (quickFilter === "discount") {
      return []; // ลดราคา: ไม่พบปลั๊กอิน
    }

    return result; // "all"
  }, [plugins, quickFilter, searchTerm]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setQuickFilter("all");
  }

  const filterButtons = [
    { id: "all", label: language === "th" ? "ทั้งหมด" : "All" },
    { id: "featured", label: language === "th" ? "แนะนำ" : "Featured" },
    { id: "free", label: language === "th" ? "ฟรี" : "Free" },
    { id: "discount", label: language === "th" ? "ลดราคา" : "On Sale" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {language === "th" ? "ปลั๊กอินทั้งหมด" : "All Plugins"}
          </h1>
          <p className="text-gray-400">
            {language === "th"
              ? "เลือกดูและดาวน์โหลดปลั๊กอินคุณภาพสูงสำหรับงานเสียงของคุณ"
              : "Browse and download high-quality audio plugins"}
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={
              language === "th"
                ? "ค้นหาปลั๊กอิน (เริ่มพิมพ์ชื่อ)..."
                : "Search plugins (starts with)..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">
                {language === "th" ? "ทุกหมวดหมู่" : "All Categories"}
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterButtons.map((btn) => {
            const isActive = quickFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setQuickFilter(btn.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                    ? "bg-cyan-400 text-black font-semibold shadow-md"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
                  }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Plugin Grid หรือ สถานะไม่พบปลั๊กอิน */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          </div>
        ) : displayedPlugins.length === 0 ? (
          <div className="text-center py-16 bg-gray-950 rounded-xl border border-gray-900">
            <p className="text-xl font-medium mb-3 text-gray-300">
              {language === "th" ? "ไม่พบปลั๊กอิน" : "No plugins found"}
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg text-sm transition-colors"
            >
              {language === "th" ? "ล้างตัวกรอง" : "Clear filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPlugins.map((plugin) => (
              <PluginCard
                key={plugin.slug || plugin.id}
                {...(plugin as any)}
                plugin={plugin as any}
                currency={currency}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ตัวอย่างตำแหน่ง array plugins ใน app/plugins/page.tsx
const plugins = [
  {
    id: "stem-splitter",
    slug: "stem-splitter",
    name: "Stem Splitter Pro",
    // ⭐️ แก้ตรงนี้: เปลี่ยน path รูปภาพให้ตรงกับรูปใหม่
    image: "/images/plugins/stem-splitter.webp",
    description: "AI-Powered Stem Separation with zero latency",
    price: 49,
    // ... ฟิลด์เดิมที่มีอยู่คงไว้ตามปกติ
  },
  {
    id: "analog-eq",
    slug: "analog-eq",
    name: "Analog EQ",
    // ⭐️ แก้ตรงนี้:
    image: "/images/plugins/analog-eq.webp",
    description: "Warm vintage analog equalizer with rich harmonics",
    price: 29,
    // ... ฟิลด์เดิมที่มีอยู่คงไว้ตามปกติ
  },
  {
    id: "drop-tune",
    slug: "drop-tune",
    name: "Drop-Tune",
    // ⭐️ แก้ตรงนี้:
    image: "/images/plugins/drop-tune.webp",
    description: "Instant pitch-shifting and octave detuning for guitars & vocals",
    price: 0, // หรือ Free
    // ... ฟิลด์เดิมที่มีอยู่คงไว้ตามปกติ
  },
];