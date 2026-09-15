"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function SubscriptionHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, currency } = useApp();

  // ราคาในสกุลเงินต่างๆ
  const monthlyPrice = currency === "USD" ? 7.99 : currency === "THB" ? 259 : 7.99;
  const yearlyPrice = currency === "USD" ? 79.99 : currency === "THB" ? 2590 : 79.99;
  const symbol = currency === "USD" ? "$" : "฿";
  const yearlySavings = currency === "USD" ? "$15.89" : "฿518";

  return (
    <div className="w-full bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 text-center md:text-left">
            <span className="font-bold text-cyan-300">
              {language === "th" ? "🎧 Crystal Pro Subscription" : "🎧 Crystal Pro Subscription"}
            </span>
            <span className="ml-2 text-sm">
              {language === "th" ? "เข้าถึงปลั๊กอินทั้งหมด + อัปเดตฟรี" : "Access all plugins + free updates"}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="font-bold text-lg">
                {symbol}
                {monthlyPrice.toFixed(currency === "THB" ? 0 : 2)}
                <span className="text-sm font-normal ml-1">
                  /{language === "th" ? "เดือน" : "month"}
                </span>
              </div>
              <div className="text-xs text-gray-300">{language === "th" ? "หรือ" : "or"}</div>
            </div>

            <div className="text-center">
              <div className="font-bold text-lg text-green-300">
                {symbol}
                {yearlyPrice.toFixed(currency === "THB" ? 0 : 2)}
                <span className="text-sm font-normal ml-1">
                  /{language === "th" ? "ปี" : "year"}
                </span>
              </div>
              <div className="text-xs text-green-200">
                {language === "th" ? `ประหยัด ${yearlySavings}` : `Save ${yearlySavings}`}
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-black font-bold px-5 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
            >
              {language === "th" ? "สมัครสมาชิก" : "Subscribe Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับ Subscription */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {language === "th" ? "สมัคร Crystal Pro" : "Subscribe to Crystal Pro"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">
                      {language === "th" ? "รายเดือน" : "Monthly Plan"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {language === "th" ? "ยกเลิกได้ทุกเมื่อ" : "Cancel anytime"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {symbol}
                      {monthlyPrice.toFixed(currency === "THB" ? 0 : 2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      /{language === "th" ? "เดือน" : "mo"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-900/30 border border-cyan-700 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-cyan-300">
                      {language === "th" ? "รายปี (แนะนำ)" : "Yearly Plan (Recommended)"}
                    </div>
                    <div className="text-sm text-cyan-200">
                      {language === "th" ? `ประหยัด ${yearlySavings}` : `Save ${yearlySavings}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-300">
                      {symbol}
                      {yearlyPrice.toFixed(currency === "THB" ? 0 : 2)}
                    </div>
                    <div className="text-sm text-gray-300">
                      /{language === "th" ? "ปี" : "yr"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {language === "th" ? "เข้าถึงปลั๊กอินทั้งหมด" : "Access to all plugins"}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {language === "th" ? "อัปเดตฟรีตลอดชีพ" : "Free lifetime updates"}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {language === "th" ? "สิทธิพิเศษสำหรับสมาชิก" : "Exclusive member benefits"}
              </div>
            </div>

            <Link
              href="/subscription"
              className="block w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg text-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {language === "th" ? "ดำเนินการชำระเงิน" : "Proceed to Payment"}
            </Link>

            <p className="text-xs text-center text-gray-500 mt-4">
              {language === "th" 
                ? "การชำระเงินปลอดภัยด้วย Stripe"
                : "Secure payment powered by Stripe"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}