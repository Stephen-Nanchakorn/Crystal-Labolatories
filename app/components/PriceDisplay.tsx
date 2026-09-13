"use client";

import { useState } from "react";

export default function PriceDisplay({
  usdPrice,
  thbPrice,  // ✅ ต้องมีบรรทัดนี้
}: {
  usdPrice: number;
  thbPrice: number;  // ✅ ต้องมี type นี้
}) {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-cyan-400">ราคา</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency("THB")}
            className={`px-3 py-1 rounded-full text-sm ${
              currency === "THB"
                ? "bg-cyan-400 text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            THB
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded-full text-sm ${
              currency === "USD"
                ? "bg-cyan-400 text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            USD
          </button>
        </div>
      </div>

      <div className="text-3xl font-bold">
        {currency === "THB" ? "฿" : "$"}
        {currency === "THB"
          ? thbPrice.toLocaleString("th-TH")  // ✅ ใช้ thbPrice
          : usdPrice.toLocaleString("en-US")}
        <span className="text-sm text-gray-400 ml-2">
          {currency === "THB" ? "บาท" : "USD"}
        </span>
      </div>

      <div className="text-sm text-gray-500 mt-2">
        {currency === "THB"
          ? `≈ $${usdPrice} USD`
          : `≈ ฿${thbPrice.toLocaleString("th-TH")} THB`}
      </div>
    </div>
  );
}