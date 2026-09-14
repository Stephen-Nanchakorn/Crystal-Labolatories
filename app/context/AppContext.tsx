"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "th" | "en";
type Currency = "THB" | "USD";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  mounted: boolean;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType>({
  language: "th",
  setLanguage: () => {},
  currency: "THB",
  setCurrency: () => {},
  mounted: false,
  t: () => "",
});

interface TranslationDict {
  [key: string]: string;
}

const translations: Record<Language, TranslationDict> = {
  th: {
    "header.home": "หน้าแรก",
    "header.plugins": "ปลั๊กอิน",
    "header.pricing": "ราคา",
    "header.support": "ช่วยเหลือ",
    "profile.settings": "ตั้งค่าบัญชี",
    "profile.language": "ภาษา",
    "profile.currency": "สกุลเงิน",
    "profile.signout": "ออกจากระบบ",
    "common.buy": "ซื้อทันที",
    "common.free": "ฟรี",
    "common.download": "ดาวน์โหลดฟรี",
    "common.thb": "บาท",
    "common.usd": "ดอลลาร์",
  },
  en: {
    "header.home": "Home",
    "header.plugins": "Plugins",
    "header.pricing": "Pricing",
    "header.support": "Support",
    "profile.settings": "Account Settings",
    "profile.language": "Language",
    "profile.currency": "Currency",
    "profile.signout": "Sign Out",
    "common.buy": "Buy Now",
    "common.free": "FREE",
    "common.download": "Download Free",
    "common.thb": "THB",
    "common.usd": "USD",
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th");
  const [currency, setCurrencyState] = useState<Currency>("THB");
  const [mounted, setMounted] = useState(false);

  // โหลดค่าที่เคยตั้งไว้ตอนเปิดเว็บครั้งแรกเท่านั้น
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    const savedCurrency = localStorage.getItem("currency") as Currency | null;

    const initialLang = savedLang === "th" || savedLang === "en" ? savedLang : "th";
    setLanguageState(initialLang);

    // ✅ ถ้าเคยเลือกสกุลเงินไว้เอง ใช้ค่านั้น ไม่งั้นใช้ default ตามภาษา
    if (savedCurrency === "THB" || savedCurrency === "USD") {
      setCurrencyState(savedCurrency);
    } else {
      setCurrencyState(initialLang === "en" ? "USD" : "THB");
    }

    setMounted(true);
  }, []);

  // ✅ เปลี่ยนภาษา -> reset สกุลเงินเป็น default ของภาษานั้นเสมอ
  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    const defaultCurrency: Currency = lang === "en" ? "USD" : "THB";
    setCurrencyState(defaultCurrency);
    localStorage.setItem("currency", defaultCurrency);
  }

  // ✅ ผู้ใช้เปลี่ยนสกุลเงินเองได้อิสระ ไม่กระทบภาษา
  function setCurrency(curr: Currency) {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  }

  function t(key: string): string {
    return translations[language][key] || key;
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, mounted, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);