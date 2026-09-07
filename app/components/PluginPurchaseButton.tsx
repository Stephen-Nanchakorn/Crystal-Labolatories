"use client";

import { useState } from "react";
import type { Plugin } from "@/data/plugins"; // ← เพิ่มบรรทัดนี้

export default function PluginPurchaseButton({ plugin }: { plugin: Plugin }) {
  const [showModal, setShowModal] = useState(false);

  if (plugin.isFree) {
    return (
      <a href={plugin.downloadUrl} download>
        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition">
          ดาวน์โหลดฟรี 🎉
        </button>
      </a>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition"
        >
          จ่ายด้วย PromptPay 🇹🇭
        </button>
        <a href={plugin.payhipUrl ?? "#"} target="_blank" rel="noopener noreferrer">
          <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition">
            Pay International 🌏
          </button>
        </a>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-4">สแกนจ่ายผ่าน PromptPay</h3>
            {/* TODO: ใส่ QR Code จริงตรงนี้ */}
            <p className="text-gray-400">QR Code จะแสดงตรงนี้</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-700 rounded-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}