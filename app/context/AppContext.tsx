"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "th" | "en";
type Currency = "THB" | "USD";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType>({
  language: "th",
  setLanguage: () => {},
  currency: "THB",
  setCurrency: () => {},
  t: () => "",
});

// ✅ ระบุ type ให้ชัดเจน
interface TranslationDict {
  [key: string]: string;
}

// ✅ ระบุ type ให้ translations object
const translations: Record<Language, TranslationDict> = {
  th: {
    // Header
    "header.home": "หน้าแรก",
    "header.plugins": "ปลั๊กอิน",
    "header.pricing": "ราคา",
    "header.support": "ช่วยเหลือ",
    "header.profile": "โปรไฟล์",
    "header.language": "ภาษา",
    
    // Profile Menu
    "profile.settings": "ตั้งค่าบัญชี",
    "profile.language": "ภาษา",
    "profile.language.th": "ไทย",
    "profile.language.en": "English",
    "profile.currency": "สกุลเงิน",
    "profile.currency.thb": "บาทไทย",
    "profile.currency.usd": "ดอลลาร์สหรัฐ",
    "profile.signout": "ออกจากระบบ",
    
    // Common
    "common.buy": "ซื้อทันที",
    "common.free": "ฟรี",
    "common.download": "ดาวน์โหลด",
    "common.price": "ราคา",
    "common.currency": "สกุลเงิน",
    "common.thb": "บาท",
    "common.usd": "ดอลลาร์",
    
    // Support Page
    "support.title": "ศูนย์ช่วยเหลือ",
    "support.subtitle": "มีคำถาม? เราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง",
    "support.livechat": "Live Chat",
    "support.email": "อีเมล",
    "support.faq": "คำถามที่พบบ่อย",
    "support.notfound": "ยังไม่พบคำตอบที่ต้องการ?",
    "support.startchat": "เริ่มแชทกับทีมงาน",
  },
  en: {
    // Header
    "header.home": "Home",
    "header.plugins": "Plugins",
    "header.pricing": "Pricing",
    "header.support": "Support",
    "header.profile": "Profile",
    "header.language": "Language",
    
    // Profile Menu
    "profile.settings": "Account Settings",
    "profile.language": "Language",
    "profile.language.th": "ไทย",
    "profile.language.en": "English",
    "profile.currency": "Currency",
    "profile.currency.thb": "Thai Baht",
    "profile.currency.usd": "US Dollar",
    "profile.signout": "Sign Out",
    
    // Common
    "common.buy": "Buy Now",
    "common.free": "FREE",
    "common.download": "Download",
    "common.price": "Price",
    "common.currency": "Currency",
    "common.thb": "THB",
    "common.usd": "USD",
    
    // Support Page
    "support.title": "Support Center",
    "support.subtitle": "Have questions? We're here to help 24/7",
    "support.livechat": "Live Chat",
    "support.email": "Email",
    "support.faq": "Frequently Asked Questions",
    "support.notfound": "Still can't find what you need?",
    "support.startchat": "Start Chat with Team",
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th");
  const [currency, setCurrencyState] = useState<Currency>("THB");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // โหลดค่าเก่าจาก localStorage
    const savedLang = localStorage.getItem("language") as Language;
    const savedCurrency = localStorage.getItem("currency") as Currency;
    
    if (savedLang === "th" || savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      // ถ้ายังไม่มีค่าใน localStorage ให้ตรวจสอบภาษาเบราว์เซอร์
      const browserLang = navigator.language.startsWith("th") ? "th" : "en";
      setLanguageState(browserLang);
    }
    
    // ตั้งค่าสกุลเงินตามภาษา
    const defaultCurrency = language === "en" ? "USD" : "THB";
    setCurrencyState(savedCurrency === "THB" || savedCurrency === "USD" ? savedCurrency : defaultCurrency);
    
    setMounted(true);
  }, [language]); // ✅ เพิ่ม dependency เพื่อ re-run เมื่อ language เปลี่ยน

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // เปลี่ยนสกุลเงินอัตโนมัติตามภาษา
    const newCurrency = lang === "en" ? "USD" : "THB";
    setCurrency(newCurrency);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  const t = (key: string): string => {
    // ✅ TypeScript รู้ type แล้ว
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);