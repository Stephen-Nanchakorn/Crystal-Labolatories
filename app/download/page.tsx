"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";

interface OwnedPlugin {
  slug: string;
  name: string;
  version: string | null;
  image_url: string | null;
}

export default function DownloadPage() {
  const { language } = useApp();
  const supabase = createClient();
  const [plugins, setPlugins] = useState<OwnedPlugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOwnedPlugins() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: invoices } = await supabase
        .from("invoices")
        .select("id, invoice_items(plugin_slug)")
        .eq("user_id", user.id)
        .eq("status", "paid");

      const slugs = Array.from(
        new Set((invoices || []).flatMap((inv: any) => inv.invoice_items.map((i: any) => i.plugin_slug)))
      );

      if (slugs.length > 0) {
        const { data: pluginsData } = await supabase
          .from("plugins")
          .select("slug, name, version, image_url")
          .in("slug", slugs);
        setPlugins(pluginsData || []);
      }

      setLoading(false);
    }

    loadOwnedPlugins();
  }, [supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {language === "th" ? "ปลั๊กอินของฉัน" : "My Plugins"}
        </h1>

        {plugins.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">
              {language === "th" ? "คุณยังไม่มีปลั๊กอิน" : "You don't own any plugins yet"}
            </p>
            <Link href="/plugins" className="text-cyan-400 hover:text-cyan-300">
              {language === "th" ? "ไปเลือกซื้อปลั๊กอิน →" : "Browse Plugins →"}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {plugins.map((plugin) => (
              <div key={plugin.slug} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {plugin.image_url && (
                      <img src={plugin.image_url} alt={plugin.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plugin.name}</h3>
                    <p className="text-gray-400 text-sm">v{plugin.version || "1.0"}</p>
                  </div>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed"
                >
                  📥 {language === "th" ? "ดาวน์โหลด (เร็วๆ นี้)" : "Download (Coming Soon)"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}