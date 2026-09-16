// /app/components/balance/TransferForm.tsx
"use client";

import { useState } from "react";

interface TransferFormProps {
  onTransfer: (email: string, amount: number, note: string) => Promise<void>;
  maxAmount: number;
  language: string;
}

export default function TransferForm({
  onTransfer,
  maxAmount,
  language
}: TransferFormProps) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (!email || !amountNum || amountNum <= 0) {
      alert(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill in all fields");
      return;
    }

    if (amountNum > maxAmount) {
      alert(language === "th" ? "เครดิตไม่เพียงพอ" : "Insufficient credits");
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransfer(email, amountNum, note);
      setEmail("");
      setAmount("");
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">
        {language === "th" ? "โอนเครดิตให้เพื่อน" : "Transfer Credits to Friend"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {language === "th" ? "อีเมลของผู้รับ" : "Recipient Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="friend@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {language === "th" ? "จำนวนเครดิต" : "Amount"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="0.00"
                min="0.01"
                max={maxAmount}
                step="0.01"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {language === "th" ? "฿" : "$"}
              </div>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {language === "th" ? "สูงสุด: " : "Max: "}
              {language === "th" ? "฿" : "$"}
              {maxAmount.toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {language === "th" ? "หมายเหตุ (ไม่จำเป็น)" : "Note (Optional)"}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              placeholder={language === "th" ? "ขอบคุณนะ!" : "Thank you!"}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            {language === "th"
              ? "สามารถโอนเครดิตให้เพื่อนที่ใช้ Crystal Lab เท่านั้น"
              : "Can only transfer to friends using Crystal Lab"}
          </p>
          
          <button
            type="submit"
            disabled={isSubmitting || !email || !amount || parseFloat(amount) > maxAmount}
            className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? (language === "th" ? "กำลังโอน..." : "Transferring...")
              : (language === "th" ? "ยืนยันการโอน" : "Confirm Transfer")
            }
          </button>
        </div>
      </form>
    </div>
  );
}