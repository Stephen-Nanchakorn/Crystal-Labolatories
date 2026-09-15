"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import CurrencyToggle from "@/app/components/CurrencyToggle";

export default function SubscriptionPage() {
  const { language, currency, setCurrency, t } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // ราคา
  const prices = {
    monthly: {
      usd: 7.99,
      thb: 259,
      savings: null,
    },
    yearly: {
      usd: 79.99,
      thb: 2590,
      savings: language === "th" ? "ประหยัด ฿518 (20%)" : "Save $15.89 (20%)",
    },
  };

  const currentPrice = prices[selectedPlan];
  const symbol = currency === "USD" ? "$" : "฿";
  const price = currency === "USD" ? currentPrice.usd : currentPrice.thb;

  // รีวิว
  const reviews = [
    {
      name: language === "th" ? "โจนาธาน หว่อง" : "Jonathan Wong",
      role: language === "th" ? "โปรดิวเซอร์, สิงคโปร์" : "Producer, Singapore",
      rating: 5,
      comment: language === "th" 
        ? "คุ้มค่าสุดๆ! ได้ปลั๊กอินคุณภาพทั้งหมดในราคาที่สมเหตุสมผล" 
        : "Incredible value! All high-quality plugins at a reasonable price.",
      date: "2026-08-15",
    },
    {
      name: language === "th" ? "มาริโกะ ซูซูกิ" : "Mariko Suzuki",
      role: language === "th" ? "วิศวกรเสียง, โตเกียว" : "Audio Engineer, Tokyo",
      rating: 5,
      comment: language === "th"
        ? "ใช้งานจริงในสตูดิโอมาตลอด 6 เดือน รีวิว 5 ดาวแน่นอน"
        : "Been using professionally in my studio for 6 months. 5 stars!",
      date: "2026-07-22",
    },
    {
      name: language === "th" ? "อเล็กซานเดอร์ มุลเลอร์" : "Alexander Müller",
      role: language === "th" ? "คอนเทนต์ครีเอเตอร์, เบอร์ลิน" : "Content Creator, Berlin",
      rating: 5,
      comment: language === "th"
        ? "อัปเดตฟรีตลอดชีพ คือจุดขายที่ดีที่สุด"
        : "Lifetime free updates are the best selling point.",
      date: "2026-06-30",
    },
    {
      name: language === "th" ? "แซม ร็อบินสัน" : "Sam Robinson",
      role: language === "th" ? "นักดนตรี, ลอนดอน" : "Musician, London",
      rating: 4,
      comment: language === "th"
        ? "เสียงดีมาก อยากให้มีปลั๊กอินประเภท mastering เพิ่ม"
        : "Great sound quality. Would love to see more mastering plugins.",
      date: "2026-05-18",
    },
  ];

  // FAQ
  const faqs = [
    {
      question: language === "th" ? "Crystal Creator Bundle มีอะไรบ้าง?" : "What's included in Crystal Creator Bundle?",
      answer: language === "th"
        ? "คุณจะได้ปลั๊กอินทั้งหมดของ Crystal Lab (Stem Splitter, Analog EQ, Drop-Tune) พร้อมอัปเดตฟรีตลอดชีพ และปลั๊กอินใหม่ที่จะออกในอนาคต"
        : "You get all Crystal Lab plugins (Stem Splitter, Analog EQ, Drop-Tune) with free lifetime updates, plus all future plugins we release.",
    },
    {
      question: language === "th" ? "สามารถยกเลิกได้เมื่อไหร่ก็ได้ไหม?" : "Can I cancel anytime?",
      answer: language === "th"
        ? "ใช่! คุณสามารถยกเลิกการสมัครสมาชิกได้ทุกเมื่อ การเข้าถึงจะสิ้นสุดเมื่อรอบบิลสิ้นสุด"
        : "Yes! You can cancel your subscription anytime. Access will end at the end of your billing cycle.",
    },
    {
      question: language === "th" ? "สามารถใช้บนหลายเครื่องได้ไหม?" : "Can I use it on multiple computers?",
      answer: language === "th"
        ? "ได้สูงสุด 2 เครื่องต่อบัญชี (เช่น เครื่องที่บ้านและที่สตูดิโอ)"
        : "Yes, up to 2 computers per account (e.g., home computer and studio computer).",
    },
    {
      question: language === "th" ? "ต้องเสียค่าใช้จ่ายเพิ่มสำหรับอัปเดตไหม?" : "Are there extra charges for updates?",
      answer: language === "th"
        ? "ไม่! อัปเดตทั้งหมดฟรีตลอดการเป็นสมาชิก"
        : "No! All updates are free as long as your subscription is active.",
    },
    {
      question: language === "th" ? "มีช่วงทดลองใช้ฟรีไหม?" : "Is there a free trial period?",
      answer: language === "th"
        ? "มี! คุณสามารถทดลองใช้ฟรี 14 วันโดยไม่ต้องใส่บัตรเครดิต"
        : "Yes! You can try free for 14 days with no credit card required.",
    },
  ];

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
        {/* Plan Selection & Currency */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          {/* Plan Toggle */}
          <div className="flex bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                selectedPlan === "monthly" 
                  ? "bg-cyan-400 text-black" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {language === "th" ? "รายเดือน" : "Monthly"}
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                selectedPlan === "yearly" 
                  ? "bg-cyan-400 text-black" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {language === "th" ? "รายปี (แนะนำ)" : "Yearly (Recommended)"}
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="hidden md:block">
            <CurrencyToggle currency={currency} setCurrency={setCurrency} />
          </div>
        </div>

        {/* Mobile Currency Toggle */}
        <div className="md:hidden flex justify-center mb-8">
          <CurrencyToggle currency={currency} setCurrency={setCurrency} />
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Main Pricing Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500 rounded-2xl p-8 relative overflow-hidden">
            {selectedPlan === "yearly" && (
              <div className="absolute top-4 right-4 bg-green-500 text-black font-bold px-4 py-1 rounded-full text-sm">
                {language === "th" ? "20% OFF" : "20% OFF"}
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === "th" ? "Crystal Creator Bundle" : "Crystal Creator Bundle"}
              </h2>
              
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold">{symbol}{price.toFixed(currency === "THB" ? 0 : 2)}</span>
                <span className="text-gray-400 ml-2">
                  /{selectedPlan === "monthly" 
                    ? (language === "th" ? "เดือน" : "month") 
                    : (language === "th" ? "ปี" : "year")}
                </span>
              </div>
              
              {currentPrice.savings && (
                <p className="text-green-400 font-semibold">{currentPrice.savings}</p>
              )}
              
              <p className="text-gray-400 mt-4">
                {language === "th"
                  ? "เข้าถึงปลั๊กอินทั้งหมด + ปลั๊กอินใหม่ที่จะออกในอนาคต"
                  : "Access to all plugins + all future plugins we release"}
              </p>
            </div>

            {/* Included Plugins */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-cyan-300">
                {language === "th" ? "รวมปลั๊กอินทั้งหมด:" : "Includes all plugins:"}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🧬</div>
                  <div className="font-medium">Stem Splitter</div>
                  <div className="text-gray-400 text-sm">AI Stem Separation</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎛️</div>
                  <div className="font-medium">Analog EQ</div>
                  <div className="text-gray-400 text-sm">7-Band EQ + Comp</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎸</div>
                  <div className="font-medium">Drop-Tune</div>
                  <div className="text-gray-400 text-sm">Pitch Shifting</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>{language === "th" ? "อัปเดตฟรีตลอดชีพ" : "Free lifetime updates"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>{language === "th" ? "ใช้ได้ 2 เครื่อง" : "Use on 2 computers"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>{language === "th" ? "ยกเลิกได้ทุกเมื่อ" : "Cancel anytime"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>{language === "th" ? "ทดลองใช้ฟรี 14 วัน" : "14-day free trial"}</span>
              </div>
            </div>

            <Link
              href={selectedPlan === "monthly" ? "/checkout/subscription-monthly" : "/checkout/subscription-yearly"}
              className="block w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 rounded-lg text-center text-lg transition-colors"
            >
              {language === "th" ? "เริ่มทดลองใช้ฟรี 14 วัน" : "Start 14-Day Free Trial"}
            </Link>
            
            <p className="text-gray-500 text-sm text-center mt-4">
              {language === "th"
                ? "ไม่ต้องใส่บัตรเครดิตสำหรับการทดลองใช้"
                : "No credit card required for trial"}
            </p>
          </div>

          {/* Compare vs Individual */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              {language === "th" ? "เทียบกับการซื้อแยก" : "Compare vs Individual"}
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{language === "th" ? "ซื้อปลั๊กอินแยกทั้งหมด" : "Buy all plugins individually"}</span>
                  <span className="font-bold">
                    {currency === "USD" ? "$158" : "฿5,148"}
                  </span>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-300 font-semibold">
                    Crystal Creator Bundle (รายปี)
                  </span>
                  <span className="font-bold text-cyan-300">
                    {symbol}{price.toFixed(currency === "THB" ? 0 : 2)}
                  </span>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: "50%" }}></div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {currency === "USD" ? "Save $78.01" : "ประหยัด ฿2,558"}
                  </div>
                  <div className="text-gray-400">
                    {language === "th" ? "กว่า 50%" : "Over 50% savings"}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h3 className="font-semibold mb-4 text-cyan-300">
                {language === "th" ? "สิทธิพิเศษเพิ่มเติม:" : "Additional benefits:"}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>• {language === "th" ? "สิทธิ์เข้ากลุ่ม Discord สมาชิก" : "Access to exclusive Discord community"}</li>
                <li>• {language === "th" ? "ดาวน์โหลด Presets พิเศษ" : "Download exclusive presets"}</li>
                <li>• {language === "th" ? "เวิร์กชอปออนไลน์ฟรี" : "Free online workshops"}</li>
                <li>• {language === "th" ? "ความช่วยเหลือทางเทคนิคแบบ Priority" : "Priority technical support"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === "th" ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <span className="font-semibold">{faq.question}</span>
                    <span className="text-cyan-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === "th" ? "รีวิวจากสมาชิก" : "Member Reviews"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-700"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-300 mb-6 italic">"{review.comment}"</p>
                
                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-lg">
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-gray-400 text-sm">{review.role} • {review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Button */}
          <div className="text-center mt-8">
            <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-8 py-3 rounded-full transition-colors">
              {language === "th" ? "➕ เขียนรีวิวของคุณ" : "➕ Write Your Review"}
            </button>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            {language === "th" ? "พร้อมอัปเกรดเสียงของคุณแล้วหรือยัง?" : "Ready to upgrade your sound?"}
          </h2>
          <p className="text-gray-400 mb-8">
            {language === "th"
              ? "เข้าร่วมโปรดิวเซอร์กว่า 10,000 คนที่เลือก Crystal Creator Bundle"
              : "Join over 10,000 producers who chose Crystal Creator Bundle"}
          </p>
          <Link
            href={selectedPlan === "monthly" ? "/checkout/subscription-monthly" : "/checkout/subscription-yearly"}
            className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-lg px-10 py-4 rounded-full transition-colors"
          >
            {language === "th" ? "เริ่มต้นทดลองใช้ฟรี" : "Start Free Trial Now"}
          </Link>
        </div>
      </div>
    </main>
  );
}