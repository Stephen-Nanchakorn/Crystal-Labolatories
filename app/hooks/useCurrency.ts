"use client";

import { useState, useEffect } from "react";

export function useCurrency() {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") setCurrency(saved);
    
    // ฟังก์ชันเมื่อมีการอัปเดตสกุลเงินในอีกหน้าต่าง/แท็บ
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "currency") {
        const newCurrency = e.newValue;
        if (newCurrency === "THB" || newCurrency === "USD") {
          setCurrency(newCurrency);
        }
      }
    }
    
    // ฟังก์ชันที่จะเรียกเมื่อหน้านี้เปลี่ยนสกุลเงิน
    const handleCurrencyChange = (e: CustomEvent) => {
      const newCurrency = e.detail.currency;
      if (newCurrency === "THB" || newCurrency === "USD") {
        setCurrency(newCurrency);
        localStorage.setItem("currency", newCurrency);
      }
    };
    
    window.addEventListener("currencyChanged", handleCurrencyChange as EventListener);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChange as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function updateCurrency(newCurrency: "THB" | "USD") {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
    // broadcast ไปหน้าอื่นในแท็บเดียวกัน
    window.dispatchEvent(
      new CustomEvent("currencyChanged", { detail: { currency: newCurrency } })
    );
  }

  return { currency, setCurrency: updateCurrency };
}