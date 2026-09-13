"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CurrencyContextType = {
  currency: "THB" | "USD";
  setCurrency: (currency: "THB" | "USD") => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "THB",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<"THB" | "USD">("THB");

  // เก็บค่าใน localStorage
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved === "THB" || saved === "USD") {
      setCurrency(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);