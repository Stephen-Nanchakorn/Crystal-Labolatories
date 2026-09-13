"use client";

import { useState } from "react";

export default function PriceDisplay({
  usdPrice,
  thbPrice,
}: {
  usdPrice: number;
  thbPrice: number;
}) {
  // ✅ ลบ useState, ลบ toggle buttons ทั้งหมด
  
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-cyan-400">ราคา</h3>
        <span className="text-xs text-gray-500">(บาท)</span>
      </div>

      {/* แสดงแค่ THB เป็นหลัก */}
      <div className="text-3xl font-bold text-white">
        ฿{thbPrice.toLocaleString("th-TH")}
        <span className="text-sm text-gray-400 ml-2">บาท</span>
      </div>

      {/* แสดง USD เป็นตัวเล็กใต้ราคาหลัก */}
      <div className="text-sm text-gray-500 mt-2">
        ≈ ${usdPrice} USD
      </div>
    </div>
  );
}