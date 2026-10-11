"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pluginPrices, type PluginId, getPluginName, getPluginPrice } from "@/lib/plugin-prices";
import { createClient } from "@/lib/supabase/client";
import { useCredit } from "@/app/actions/credit";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [applyCredits, setApplyCredits] = useState<boolean>(false);
  const [addBundle, setAddBundle] = useState<boolean>(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") setCurrency(saved);
  }, []);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // โหลดข้อมูล User และ Balance เครดิต
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const { data: profile } = await supabase
          .from("users")
          .select("balance")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.balance) {
          setUserBalance(profile.balance);
        }
      }
    }
    loadUserData();
  }, [supabase]);

  if (!resolvedParams) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="text-center">กำลังโหลด...</div>
      </main>
    );
  }

  const { id: pluginId } = resolvedParams;
  const plugin = pluginPrices[pluginId as PluginId] || { name: "Unknown", usd: 0, thb: 0 };
  const basePrice = currency === "THB" ? plugin.thb : plugin.usd;
  const symbol = currency === "THB" ? "฿" : "$";

  // กำหนดคู่หู Mix & Match Bundle
  const bundlePartnerSlug = pluginId === "stem-splitter" ? "analog-eq" : pluginId === "analog-eq" ? "stem-splitter" : null;
  const bundlePartnerFullPrice = bundlePartnerSlug ? getPluginPrice(bundlePartnerSlug, currency) : 0;
  const bundleDiscountRate = 0.25; // ส่วนลด 25%
  const bundlePartnerDiscountedPrice = Math.round(bundlePartnerFullPrice * (1 - bundleDiscountRate));

  // คำนวณยอดรวมในตะกร้าก่อนหักเครดิต
  const cartSubtotal = basePrice + (addBundle ? bundlePartnerDiscountedPrice : 0);

  // คำนวณเครดิตเพื่อนแนะนำที่จะใช้หัก (เฉพาะสกุลเงิน THB)
  const creditApplicable = currency === "THB" && applyCredits ? Math.min(userBalance, cartSubtotal) : 0;
  const finalPayableAmount = Math.max(0, cartSubtotal - creditApplicable);

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/checkout/${pluginId}`);
        return;
      }

      const baseUrl = window.location.origin;

      // 1. กรณีเป็นปลั๊กอินฟรีตัวเดียว
      if (pluginId === "drop-tune" && !addBundle) {
        const res = await fetch("/api/plugins/claim-free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pluginId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to claim free plugin");
        router.push(`/purchase-success?plugin=${pluginId}&free=true`);
        return;
      }

      // 2. กรณีใช้เครดิตจ่ายเต็มจำนวน 100% (ไม่ต้องผ่าน Stripe)
      if (creditApplicable > 0 && finalPayableAmount === 0) {
        const orderId = `credit_order_${Date.now()}`;
        const itemsToPurchase = [{ name: plugin.name, price: basePrice }];
        if (addBundle && bundlePartnerSlug) {
          itemsToPurchase.push({
            name: `${getPluginName(bundlePartnerSlug)} (Bundle 25% Off)`,
            price: bundlePartnerDiscountedPrice,
          });
        }

        const creditResult = await useCredit(
          user.id,
          creditApplicable,
          orderId,
          itemsToPurchase,
          `ชำระเงินปลั๊กอินด้วยเครดิต ${itemsToPurchase.map((i) => i.name).join(", ")}`
        );

        if (!creditResult.success) {
          throw new Error(creditResult.error || "ไม่สามารถหักเครดิตได้");
        }

        router.push(`/purchase-success?plugin=${pluginId}&free=true`);
        return;
      }

      // 3. ชำระเงินผ่าน Stripe Checkout Session (พร้อมส่ง Bundle เข้า Session)
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pluginId,
          quantity: 1,
          currency,
          successUrl: `${baseUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/plugins/${pluginId}`,
          userId: user.id,
          customerEmail: user.email,
          bundlePluginId: addBundle && bundlePartnerSlug ? bundlePartnerSlug : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      router.push(data.url);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการชำระเงิน");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">สรุปคำสั่งซื้อ & ชำระเงิน</h1>

        {/* รายการหลัก */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{plugin.name}</h2>
              <p className="text-xs text-gray-400 mt-1">Lifetime License • สิทธิ์ใช้งาน 2 เครื่อง</p>
            </div>
            <div className="text-xl font-bold text-cyan-400">
              {symbol}{basePrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 🌟 Mix & Match Bundle Upsell Card */}
        {bundlePartnerSlug && (
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950/40 border border-cyan-500/40 rounded-xl p-5 mb-6 shadow-lg shadow-cyan-500/10">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="bundle-checkbox"
                checked={addBundle}
                onChange={(e) => setAddBundle(e.target.checked)}
                className="w-5 h-5 mt-1 accent-cyan-400 cursor-pointer"
              />
              <label htmlFor="bundle-checkbox" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-500 text-black text-xs font-black px-2 py-0.5 rounded">
                    BUNDLE DEAL -25%
                  </span>
                  <span className="font-bold text-white text-base">
                    เพิ่ม {getPluginName(bundlePartnerSlug)} ในราคาสุดคุ้ม!
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  โปรโมชัน Mix & Match จับคู่พิเศษ ลดทันที 25% จากราคาปกติ{" "}
                  <span className="line-through">{symbol}{bundlePartnerFullPrice.toLocaleString()}</span>{" "}
                  เหลือเพียง <strong className="text-cyan-400">{symbol}{bundlePartnerDiscountedPrice.toLocaleString()}</strong>
                </p>
              </label>
            </div>
          </div>
        )}

        {/* 🌟 Referral Credit Auto-Apply Section */}
        {userBalance > 0 && currency === "THB" && (
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-green-950/40 border border-green-500/40 rounded-xl p-5 mb-6 shadow-lg shadow-green-500/10">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="credit-checkbox"
                checked={applyCredits}
                onChange={(e) => setApplyCredits(e.target.checked)}
                className="w-5 h-5 mt-1 accent-green-400 cursor-pointer"
              />
              <label htmlFor="credit-checkbox" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-black text-xs font-black px-2 py-0.5 rounded">
                    WALLET CREDIT
                  </span>
                  <span className="font-bold text-white text-base">
                    ใช้เครดิตเพื่อนแนะนำหักลดราคาในตะกร้า
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  คุณมียอดเครดิตสะสมคงเหลือ{" "}
                  <strong className="text-green-400">฿{userBalance.toLocaleString()}</strong>{" "}
                  (ระบบจะหักลดให้อัตโนมัติสูงสุด ฿{Math.min(userBalance, cartSubtotal).toLocaleString()})
                </p>
              </label>
            </div>
          </div>
        )}

        {/* ยอดสรุปการคำนวณราคา */}
        <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-6 mb-6 space-y-3">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>ยอดรวมสินค้า</span>
            <span>{symbol}{cartSubtotal.toLocaleString()}</span>
          </div>

          {addBundle && (
            <div className="flex justify-between text-cyan-400 text-sm">
              <span>ส่วนลด Mix & Match Bundle (25%)</span>
              <span>-{symbol}{(bundlePartnerFullPrice - bundlePartnerDiscountedPrice).toLocaleString()}</span>
            </div>
          )}

          {creditApplicable > 0 && (
            <div className="flex justify-between text-green-400 text-sm font-semibold">
              <span>ส่วนลดเครดิตเพื่อนแนะนำ (Auto-Applied)</span>
              <span>-฿{creditApplicable.toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-gray-800 pt-3 flex justify-between items-baseline">
            <span className="font-bold text-lg text-white">ยอดชำระสุทธิ</span>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-cyan-400">
                {symbol}{finalPayableAmount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                สกุลเงิน:{" "}
                <button
                  onClick={() => setCurrency(currency === "THB" ? "USD" : "THB")}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  {currency === "THB" ? "บาทไทย (THB)" : "USD ($)"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่มดำเนินการสั่งซื้อ */}
        <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 py-4 rounded-xl font-black text-black text-lg shadow-xl shadow-cyan-500/20 disabled:opacity-50 transition-all transform hover:scale-[1.01]"
          >
            {loading
              ? "กำลังดำเนินการ..."
              : creditApplicable > 0 && finalPayableAmount === 0
              ? "⚡ ชำระด้วยเครดิตทันที (ฟรี 100%)"
              : `🛒 ดำเนินการชำระเงิน - ${symbol}${finalPayableAmount.toLocaleString()}`}
          </button>
        </form>

        {error && (
          <p className="text-red-400 bg-red-950/40 border border-red-800 p-3 rounded-xl mt-4 text-center text-sm">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
