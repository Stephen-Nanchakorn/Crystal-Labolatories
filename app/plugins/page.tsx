"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import PluginCard from "@/app/components/plugins/PluginCard";

// ==================== TYPES ====================
interface Plugin {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string | null;
  image_url: string | null;
  discount_percent: number;
  is_free: boolean;
  is_featured: boolean;
  tags: string[];
  features: any[];
  created_at: string;
}

// ==================== MAIN COMPONENT ====================
export default function PluginsPage() {
  const { language } = useApp();
  const supabase = createClient();
  
  // ==================== STATES ====================
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ==================== EFFECTS ====================
  useEffect(() => {
    async function loadPlugins() {
      setLoading(true);
      
      try {
        // ดึงข้อมูล plugins จาก Supabase
        let query = supabase
          .from("plugins")
          .select("*")
          .order("created_at", { ascending: false });

        // Filter by category ถ้าเลือก
        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        // Filter by search term ถ้ามี
        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error loading plugins:", error);
        } else {
          setPlugins(data || []);
          
          // ดึง categories ทั้งหมด
          const { data: categoriesData } = await supabase
            .from("plugins")
            .select("category")
            .not("category", "is", null);
          
          const uniqueCategories = Array.from(
            new Set(categoriesData?.map((c: any) => c.category).filter(Boolean))
          ) as string[];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPlugins();
  }, [selectedCategory, searchTerm, supabase]);

  // ==================== FUNCTIONS ====================
  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
  }

  // ==================== RENDER ====================
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "th" ? "ปลั๊กอินทั้งหมด" : "All Plugins"}
          </h1>
          <p className="text-gray-400">
            {language === "th"
              ? "ค้นพบปลั๊กอินเสียงคุณภาพจาก Crystal Lab"
              : "Discover quality audio plugins from Crystal Lab"}
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* SEARCH BAR */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === "th" ? "ค้นหาปลั๊กอิน..." : "Search plugins..."}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pl-12 text-white focus:border-cyan-500 focus:outline-none"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">
                  {language === "th" ? "ทุกหมวดหมู่" : "All Categories"}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QUICK FILTERS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === "all" ? "bg-cyan-400 text-black" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}
            >
              {language === "th" ? "ทั้งหมด" : "All"}
            </button>
            <button
              onClick={() => {
                const featuredPlugins = plugins.filter(p => p.is_featured);
                setPlugins(featuredPlugins);
              }}
              className="px-4 py-2 rounded-lg bg-gray-900 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {language === "th" ? "แนะนำ" : "Featured"}
            </button>
            <button
              onClick={() => {
                const freePlugins = plugins.filter(p => p.is_free);
                setPlugins(freePlugins);
              }}
              className="px-4 py-2 rounded-lg bg-gray-900 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {language === "th" ? "ฟรี" : "Free"}
            </button>
            <button
              onClick={() => {
                const discountedPlugins = plugins.filter(p => p.discount_percent > 0);
                setPlugins(discountedPlugins);
              }}
              className="px-4 py-2 rounded-lg bg-gray-900 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {language === "th" ? "ลดราคา" : "On Sale"}
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">
              {language === "th" ? "กำลังโหลดปลั๊กอิน..." : "Loading plugins..."}
            </p>
          </div>
        ) : plugins.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🎧</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "ไม่พบปลั๊กอิน" : "No plugins found"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูสิ"
                : "Try changing your search term or category"}
            </p>
            <button
              onClick={clearFilters}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              {language === "th" ? "ล้างตัวกรอง" : "Clear Filters"}
            </button>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="mb-6 text-gray-400">
              {language === "th"
                ? `พบ ${plugins.length} ปลั๊กอิน`
                : `Found ${plugins.length} plugins`}
            </div>

            {/* PLUGIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => (
                <PluginCard
                  key={plugin.slug}
                  slug={plugin.slug}
                  name={plugin.name}
                  description={plugin.description}
                  price={plugin.price}
                  currency={plugin.currency}
                  imageUrl={plugin.image_url || undefined}
                  category={plugin.category || undefined}
                  discountPercent={plugin.discount_percent}
                  isFree={plugin.is_free}
                  isFeatured={plugin.is_featured}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}