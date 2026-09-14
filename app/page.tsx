"use client";

import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function HomePage() {
  const { t } = useApp();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">{t("home.hero.title")}</span>
            <br />
            <span className="text-cyan-400">{t("home.hero.subtitle")}</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Professional-grade audio processing tools used by producers worldwide
          </p>
          <Link
            href="/plugins"
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105"
          >
            {t("home.hero.cta")} →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">{t("home.features.title")}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="text-cyan-400 text-4xl mb-4">🎚️</div>
              <h3 className="text-xl font-bold mb-3">{t("home.features.studio")}</h3>
              <p className="text-gray-400">{t("home.features.studio.desc")}</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="text-cyan-400 text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3">{t("home.features.compatible")}</h3>
              <p className="text-gray-400">{t("home.features.compatible.desc")}</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="text-cyan-400 text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3">{t("home.features.license")}</h3>
              <p className="text-gray-400">{t("home.features.license.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t("home.cta.title")}</h2>
          <Link
            href="/plugins/drop-tune"
            className="inline-block border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold text-lg px-8 py-4 rounded-full transition-all"
          >
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </main>
  );
}