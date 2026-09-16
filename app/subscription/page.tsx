"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function SubscriptionPage() {
  const { language } = useApp();

  // ✅ ข้อ 1: แสดงทั้ง 2 แพนเลย ไม่ต้องกดเปลี่ยน
  const plans = [
    {
      type: "monthly",
      usd: 7.99,
      thb: 259,
      name: language === "th" ? "รายเดือน" : "Monthly",
      description: language === "th" 
        ? "เหมาะสำหรับผู้เริ่มต้นหรือทดลองใช้" 
        : "Perfect for beginners or trying out",
      features: [
        language === "th" ? "เข้าถึงปลั๊กอินทั้งหมด" : "Access to all plugins",
        language === "th" ? "อัปเดตฟรีตลอดการเป็นสมาชิก" : "Free updates while subscribed",
        language === "th" ? "ยกเลิกได้ทุกเมื่อ" : "Cancel anytime",
        language === "th" ? "ใช้ได้ 1 เครื่อง" : "Use on 1 computer",
      ],
    },
    {
      type: "yearly",
      usd: 79.99,
      thb: 2590,
      name: language === "th" ? "รายปี (แนะนำ)" : "Yearly (Recommended)",
      description: language === "th" 
        ? "คุ้มค่าสุดสำหรับโปรดิวเซอร์ที่ใช้งานจริง" 
        : "Best value for serious producers",
      features: [
        language === "th" ? "เข้าถึงปลั๊กอินทั้งหมด + ปลั๊กอินใหม่" : "Access to all plugins + future plugins",
        language === "th" ? "อัปเดตฟรีตลอดชีพ" : "Free lifetime updates",
        language === "th" ? "ใช้ได้ 2 เครื่อง" : "Use on 2 computers",
        language === "th" ? "ส่วนลด 20% จากรายเดือน" : "20% off monthly price",
        language === "th" ? "สิทธิ์เข้ากลุ่ม Discord สมาชิก" : "Access to members-only Discord",
        language === "th" ? "ดาวน์โหลด Presets พิเศษ" : "Download exclusive presets",
      ],
    },
  ];

  // ✅ ข้อ 2: ลบรีวิวปลอมออกหมด ไม่แสดงคอมเมนต์
  // ✅ ข้อ 3: ลบ CTA บน Footer ออกแล้ว (เหลือแค่ข้างล่าง)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-cyan-900/30 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Crystal Creator</span>
            <br />
            <span className="text-cyan-400">{language === "th" ? "Bundle" : "Bundle"}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {language === "th"
              ? "ปลั๊กอินระดับสตูดิโอทั้งหมดในแพ็กเกจเดียว อัปเดตฟรีตลอดชีพ"
              : "All studio-grade plugins in one bundle. Free lifetime updates."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ✅ ข้อ 1: แสดงทั้ง 2 แพนคู่กัน ไม่ต้องกดเปลี่ยน */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.type}
              className={`border rounded-2xl p-8 relative overflow-hidden ${
                plan.type === "yearly" 
                  ? "border-cyan-500 bg-gradient-to-br from-gray-900 to-black" 
                  : "border-gray-700 bg-gray-900"
              }`}
            >
              {plan.type === "yearly" && (
                <div className="absolute top-4 right-4 bg-green-500 text-black font-bold px-4 py-1 rounded-full text-sm">
                  {language === "th" ? "แนะนำ" : "RECOMMENDED"}
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">
                    {language === "th" ? "฿" : "$"}{plan.type === "monthly" ? plan.thb : plan.usd}
                  </span>
                  <span className="text-gray-400 ml-2">
                    /{plan.type === "monthly" 
                      ? (language === "th" ? "เดือน" : "mo") 
                      : (language === "th" ? "ปี" : "yr")}
                  </span>
                </div>
                
                {plan.type === "yearly" && (
                  <div className="mt-2">
                    <span className="text-gray-400 line-through mr-2">
                      {language === "th" ? "฿3,108" : "$95.88"}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {language === "th" ? "ประหยัด 20%" : "Save 20%"}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/checkout/subscription-${plan.type}`}
                className={`block w-full font-bold py-4 rounded-lg text-center text-lg transition-colors ${
                  plan.type === "yearly"
                    ? "bg-cyan-400 hover:bg-cyan-500 text-black"
                    : "border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                }`}
              >
                {plan.type === "yearly"
                  ? (language === "th" ? "สมัครรายปี" : "Subscribe Yearly")
                  : (language === "th" ? "สมัครรายเดือน" : "Subscribe Monthly")}
              </Link>
              
              <p className="text-gray-500 text-sm text-center mt-4">
                {plan.type === "yearly"
                  ? (language === "th" 
                    ? "ทดลองใช้ฟรี 14 วัน ไม่ต้องใส่บัตรเครดิต" 
                    : "14-day free trial, no credit card required")
                  : (language === "th" 
                    ? "ทดลองใช้ฟรี 7 วัน" 
                    : "7-day free trial")}
              </p>
            </div>
          ))}
        </div>

        {/* Included Plugins */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === "th" ? "รวมปลั๊กอินทั้งหมด" : "All Plugins Included"}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">🧬</div>
              <h3 className="text-xl font-bold mb-2">Stem Splitter</h3>
              <p className="text-gray-400 mb-4">
                {language === "th" 
                  ? "แยกเสียงดนตรีด้วย AI ความละเอียดสูง" 
                  : "AI-powered high-precision stem separation"}
              </p>
              <div className="text-sm text-gray-500">
                {language === "th" ? "ราคาแยก: ฿3,249" : "Individual: $99"}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">🎛️</div>
              <h3 className="text-xl font-bold mb-2">Analog EQ</h3>
              <p className="text-gray-400 mb-4">
                {language === "th" 
                  ? "Graphic EQ 7-Band พร้อม Gate และ Compressor" 
                  : "7-band Graphic EQ with built-in Gate & Compressor"}
              </p>
              <div className="text-sm text-gray-500">
                {language === "th" ? "ราคาแยก: ฿1,949" : "Individual: $59"}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">🎸</div>
              <h3 className="text-xl font-bold mb-2">Drop-Tune</h3>
              <p className="text-gray-400 mb-4">
                {language === "th" 
                  ? "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass" 
                  : "Free pitch-tuning plugin for Guitar, Bass"}
              </p>
              <div className="text-sm text-gray-500">
                {language === "th" ? "ราคาแยก: ฟรี" : "Individual: FREE"}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === "th" ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: language === "th" ? "ทดลองใช้ฟรีได้กี่วัน?" : "How long is the free trial?",
                a: language === "th" 
                  ? "แผนรายปีทดลองใช้ฟรี 14 วัน แผนรายเดือนทดลองใช้ฟรี 7 วัน"
                  : "Yearly plan: 14-day free trial. Monthly plan: 7-day free trial."
              },
              {
                q: language === "th" ? "ยกเลิกได้เมื่อไหร่?" : "When can I cancel?",
                a: language === "th" 
                  ? "ยกเลิกได้ทุกเมื่อ ระบบจะสิ้นสุดเมื่อรอบบิลสิ้นสุด"
                  : "Cancel anytime. Your subscription will end at the end of your billing cycle."
              },
              {
                q: language === "th" ? "จะได้ปลั๊กอินใหม่ไหม?" : "Do I get new plugins?",
                a: language === "th" 
                  ? "ได้! สมาชิกแบบรายปีจะได้ปลั๊กอินใหม่ทั้งหมดที่เราปล่อยในอนาคต"
                  : "Yes! Yearly subscribers get all future plugins we release."
              },
              {
                q: language === "th" ? "ใช้กับ DAW อะไรได้บ้าง?" : "Which DAWs are supported?",
                a: language === "th" 
                  ? "รองรับ Pro Tools, Logic, Ableton, FL Studio และ DAW ที่รองรับ AU/VST3/AAX"
                  : "Supports Pro Tools, Logic, Ableton, FL Studio and any DAW that supports AU/VST3/AAX."
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <span className="font-semibold">{faq.q}</span>
                    <span className="text-cyan-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ ข้อ 3: ลบ Footer CTA ทั้งหมดออกแล้ว - ไม่มี CTA ข้างล่างอีกต่อไป */}
      </div>
    </main>
  );
}