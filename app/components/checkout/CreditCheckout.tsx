"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { checkBalanceBeforeCheckout, useCredit } from "@/app/actions/credit";

interface CreditCheckoutProps {
  cartTotal: number;
  items: Array<{ id: string; name: string; price: number }>;
  onCheckout: (creditUsed: number, finalAmount: number) => void;
  language: string;
}

export default function CreditCheckout({
  cartTotal,
  items,
  onCheckout,
  language
}: CreditCheckoutProps) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [useMyCredit, setUseMyCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function loadUserAndBalance() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // เช็ค balance
        const result = await checkBalanceBeforeCheckout(user.id, cartTotal);
        if (result.success) {
          setBalance(result.userBalance);
          setCreditAmount(Math.min(result.userBalance, cartTotal));
        }
      }
      setLoading(false);
    }
    loadUserAndBalance();
  }, [supabase.auth, cartTotal]);

  const handleCreditChange = (value: number) => {
    if (value <= balance && value <= cartTotal) {
      setCreditAmount(value);
    }
  };

  const handleCheckout = async () => {
    if (!userId || !useMyCredit || creditAmount <= 0) {
      onCheckout(0, cartTotal);
      return;
    }

    setCheckoutLoading(true);
    try {
      // สร้าง order id ชั่วคราว
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // ใช้เครดิต
      const result = await useCredit(
        userId,
        creditAmount,
        orderId,
        items,
        language === "th" ? "การชำระเงินด้วยเครดิต" : "Payment with credits"
      );

      if (result.success) {
        const finalAmount = cartTotal - creditAmount;
        onCheckout(creditAmount, finalAmount);
        
        // แสดงข้อความสำเร็จ
        alert(
          language === "th"
            ? `ใช้เครดิต ${creditAmount} ฿ สำเร็จ! ยอดที่ต้องชำระ: ${finalAmount} ฿`
            : `Used ${creditAmount} credits successfully! Amount to pay: $${finalAmount}`
        );
      } else {
        alert(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const symbol = language === "th" ? "฿" : "$";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">
        {language === "th" ? "ใช้เครดิตของฉัน" : "Use My Credits"}
      </h3>

      {/* Balance Info */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">
            {language === "th" ? "ยอดเครดิตของคุณ:" : "Your credit balance:"}
          </span>
          <span className="text-cyan-400 font-bold text-lg">
            {symbol}{balance.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {language === "th"
            ? `สามารถใช้ได้สูงสุด ${symbol}${Math.min(balance, cartTotal).toFixed(2)}`
            : `Can use up to ${symbol}${Math.min(balance, cartTotal).toFixed(2)}`}
        </div>
      </div>

      {/* Use Credit Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={useMyCredit}
              onChange={(e) => {
                setUseMyCredit(e.target.checked);
                if (!e.target.checked) {
                  setCreditAmount(0);
                }
              }}
              className="sr-only"
              disabled={balance <= 0}
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${useMyCredit ? 'bg-cyan-500' : 'bg-gray-700'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${useMyCredit ? 'left-7' : 'left-1'}`}></div>
            </div>
          </div>
          <span className="font-medium">
            {language === "th" ? "ใช้เครดิตลดราคา" : "Use credits for discount"}
          </span>
        </label>
      </div>

      {/* Credit Amount Slider */}
      {useMyCredit && balance > 0 && (
        <div className="mb-6">
          <label className="block text-gray-400 mb-3">
            {language === "th" ? "จำนวนเครดิตที่ต้องการใช้:" : "Amount of credits to use:"}
          </label>
          
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={Math.min(balance, cartTotal)}
              step="1"
              value={creditAmount}
              onChange={(e) => handleCreditChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{language === "th" ? "ครึ่งหนึ่ง" : "Half"}</span>
              <span>{Math.min(balance, cartTotal).toFixed(0)}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="relative mb-4">
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => handleCreditChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg text-center focus:border-cyan-500 focus:outline-none"
              min="0"
              max={Math.min(balance, cartTotal)}
              step="1"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {symbol}
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-2 mb-6">
            {[25, 50, 75, 100].map((percent) => {
              const amount = Math.floor(Math.min(balance, cartTotal) * (percent / 100));
              return (
                <button
                  key={percent}
                  onClick={() => handleCreditChange(amount)}
                  className={`flex-1 py-2 rounded-lg transition-colors ${creditAmount === amount ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {percent}%
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-400">
                {language === "th" ? "ราคาสินค้า:" : "Cart total:"}
              </span>
              <span>{symbol}{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">
                {language === "th" ? "เครดิตที่ใช้:" : "Credit used:"}
              </span>
              <span className="text-cyan-400">-{symbol}{creditAmount.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{language === "th" ? "ยอดที่ต้องชำระ:" : "Amount to pay:"}</span>
                <span className="text-green-400">
                  {symbol}{(cartTotal - creditAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={checkoutLoading || (useMyCredit && creditAmount <= 0)}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${checkoutLoading ? 'bg-gray-700 text-gray-400' : 'bg-cyan-400 hover:bg-cyan-500 text-black'}`}
      >
        {checkoutLoading
          ? (language === "th" ? "กำลังประมวลผล..." : "Processing...")
          : language === "th"
          ? `ดำเนินการชำระเงิน ${symbol}${(cartTotal - creditAmount).toFixed(2)}`
          : `Proceed to Pay ${symbol}${(cartTotal - creditAmount).toFixed(2)}`
        }
      </button>

      {/* Note */}
      {useMyCredit && (
        <p className="text-gray-500 text-sm mt-4 text-center">
          {language === "th"
            ? "เครดิตจะถูกหักทันทีหลังจากยืนยันการชำระเงิน"
            : "Credits will be deducted immediately after confirming payment"}
        </p>
      )}
    </div>
  );
}