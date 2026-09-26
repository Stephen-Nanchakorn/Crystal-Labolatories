"use client"; // ✅ เพิ่มบรรทัดนี้เป็นบรรทัดแรก

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { pluginPrices, type PluginId } from "@/lib/plugin-prices";

export default function PurchaseSuccessPage() {
  const { language } = useApp();
  const searchParams = useSearchParams();
  
  const [pluginId, setPluginId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const freeParam = searchParams.get("free");
  const pluginParam = searchParams.get("plugin");

  useEffect(() => {
    async function verify() {
      try {
        if (freeParam === "true" && pluginParam) {
          setPluginId(pluginParam);
        } else if (sessionId) {
          const res = await fetch(`/api/verify-checkout-session?session_id=${sessionId}`);
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || "ไม่สามารถยืนยันการชำระเงินได้");
          }

          setPluginId(data.pluginId);
        } else {
          throw new Error("ไม่พบข้อมูลการสั่งซื้อ");
        }
      } catch (err: any) {
        console.error("Error verifying purchase:", err);
        setError(err.message || (language === "th" ? "เกิดข้อผิดพลาด" : "An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId, freeParam, pluginParam, language]);

  // ... โค้ด render ตามเดิม
}