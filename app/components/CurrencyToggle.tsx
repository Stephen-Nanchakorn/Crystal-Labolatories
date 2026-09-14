"use client";

export default function CurrencyToggle({
  currency,
  setCurrency,
}: {
  currency: "THB" | "USD";
  setCurrency: (c: "THB" | "USD") => void;
}) {
  return (
    <div className="relative inline-flex bg-gray-800 rounded-full p-1 w-72">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-cyan-400 rounded-full transition-transform duration-300 ease-in-out ${
          currency === "USD" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
        }`}
      />
      <button
        onClick={() => setCurrency("THB")}
        className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${currency === "THB" ? "text-black" : "text-gray-300"}`}
      >
        🇹🇭 ไทย (บาท)
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${currency === "USD" ? "text-black" : "text-gray-300"}`}
      >
        🇺🇸 สากล (ดอลลาร์)
      </button>
    </div>
  );
}