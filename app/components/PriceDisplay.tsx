"use client";

import { useCurrency } from "@/app/context/CurrencyContext"; // ✅ เปลี่ยนตรงนี้

const priceData = {
  "drop-tune": { thb: 0, usd: 0 },
  "stem-splitter": { thb: 3249, usd: 99 },
  "analog-eq": { thb: 1949, usd: 59 },
};

export default function PriceDisplay({
  pluginId,
}: {
  pluginId: "drop-tune" | "stem-splitter" | "analog-eq";
}) {
  const { currency, mounted } = useCurrency();

  const price = priceData[pluginId] || { thb: 0, usd: 0 };
  const currentPrice = currency === "THB" ? price.thb : price.usd;
  const symbol = currency === "THB" ? "฿" : "$";

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h3 className="font-semibold text-cyan-400 mb-3">ราคา</h3>
      <div className="text-3xl font-bold text-white">
        {mounted ? (
          <>
            {symbol}
            {currentPrice.toLocaleString(currency === "THB" ? "th-TH" : "en-US")}
          </>
        ) : (
          "..."
        )}
      </div>
    </div>
  );
}