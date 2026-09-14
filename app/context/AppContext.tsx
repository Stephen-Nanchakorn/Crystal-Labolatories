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
    // Header & Navigation
    "header.home": "หน้าแรก",
    "header.plugins": "ปลั๊กอิน",
    "header.pricing": "ราคา",
    "header.support": "ช่วยเหลือ",
    "header.profile": "โปรไฟล์",
    
    // Profile Menu
    "profile.settings": "ตั้งค่าบัญชี",
    "profile.language": "ภาษา",
    "profile.currency": "สกุลเงิน",
    "profile.signout": "ออกจากระบบ",
    
    // Common
    "common.buy": "ซื้อทันที",
    "common.free": "ฟรี",
    "common.download": "ดาวน์โหลดฟรี",
    "common.download_now": "ดาวน์โหลดเลย",
    "common.try_demo": "ทดลองใช้ฟรี",
    "common.thb": "บาท",
    "common.usd": "ดอลลาร์",
    "common.price": "ราคา",
    "common.contact": "ติดต่อ",
    "common.learn_more": "เรียนรู้เพิ่มเติม",
    "common.back": "ย้อนกลับ",
    "common.save": "บันทึก",
    "common.cancel": "ยกเลิก",
    "common.edit": "แก้ไข",
    
    // Home Page
    "home.hero.title": "ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ",
    "home.hero.subtitle": "สำหรับโปรดิวเซอร์สมัยใหม่",
    "home.hero.cta": "ดูปลั๊กอินทั้งหมด",
    "home.features.title": "ทำไมต้องเลือก Crystal Lab?",
    "home.features.studio": "คุณภาพระดับสตูดิโอ",
    "home.features.studio.desc": "เสียงที่ผ่านการออกแบบและทดสอบโดยวิศวกรมืออาชีพ",
    "home.features.compatible": "ใช้งานได้ทุกโปรแกรม",
    "home.features.compatible.desc": "รองรับ Pro Tools, Logic, Ableton และ DAW อื่นๆ",
    "home.features.license": "สิทธิ์ใช้งานตลอดชีพ",
    "home.features.license.desc": "ซื้อครั้งเดียว ใช้งานได้ตลอดชีพ พร้อมอัปเดตฟรี",
    "home.cta.title": "พร้อมเริ่มสร้างเสียงของคุณแล้วหรือยัง?",
    "home.cta.button": "เริ่มใช้งานฟรี",
    
    // Pricing Page
    "pricing.title": "ราคา",
    "pricing.subtitle": "เลือกแผนที่เหมาะกับคุณ",
    "pricing.free": "ฟรี",
    "pricing.free.desc": "สำหรับเริ่มต้น",
    "pricing.pro": "ระดับมืออาชีพ",
    "pricing.pro.desc": "สำหรับสตูดิโอ",
    "pricing.bundle": "แพ็กเกจ",
    "pricing.bundle.desc": "คุ้มค่าสุด",
    "pricing.features": "ฟีเจอร์ทั้งหมด",
    "pricing.license": "License ตลอดชีพ",
    "pricing.updates": "อัปเดตฟรี",
    "pricing.support": "การสนับสนุน",
    "pricing.money_back": "คืนเงินภายใน 30 วัน",
    
    // Support Page
    "support.title": "ศูนย์ช่วยเหลือ",
    "support.subtitle": "เราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง",
    "support.livechat": "แชทสด",
    "support.email": "อีเมล",
    "support.faq": "คำถามที่พบบ่อย",
    "support.notfound": "ยังไม่พบคำตอบที่ต้องการ?",
    "support.startchat": "เริ่มแชทกับทีมงาน",
    "support.faq.license": "ซื้อปลั๊กอินแล้วได้รับ License ตอนไหน?",
    "support.faq.compatible": "ปลั๊กอินใช้งานร่วมกับ DAW อะไรได้บ้าง?",
    "support.faq.refund": "ขอคืนเงินได้ไหม?",
    "support.faq.password": "ลืมรหัสผ่านทำอย่างไร?",
    "support.faq.devices": "ใช้ License เดียวได้กี่เครื่อง?",
    "support.faq.trial": "มีเวอร์ชันทดลองใช้ฟรีไหม?",
    
    // Plugins Page
    "plugins.title": "ปลั๊กอิน",
    "plugins.subtitle": "ปลั๊กอินเสียงคุณภาพระดับสตูดิโอ สำหรับโปรดิวเซอร์สมัยใหม่",
    "plugins.drop_tune.desc": "ปลั๊กอินปรับจูนเสียงฟรี สำหรับ Guitar, Bass และ Keyboard พร้อมกลิ่นอายเสียงแบบ Analog Gear",
    "plugins.stem_splitter.desc": "แยกเสียงดนตรีด้วย AI ความละเอียดสูง แยกได้ถึง 10 ส่วน ตั้งแต่ Vocal ไปจนถึง Strings",
    "plugins.analog_eq.desc": "Graphic EQ สไตล์ Knob 7-Band พร้อม Gate และ Compressor ในตัว ออกแบบมาเพื่อย่านเสียง Guitar & Bass โดยเฉพาะ",
    "plugins.compatibility": "ใช้งานกับ Pro Tools, Logic, Ableton",
    "plugins.requirements": "MacOS Ventura ขึ้นไป",
    "plugins.formats": "AU, VST3, AAX formats",
    
    // Profile Page
    "profile.title": "โปรไฟล์ของฉัน",
    "profile.account": "ข้อมูลบัญชี",
    "profile.name": "ชื่อที่แสดง",
    "profile.enter_name": "ใส่ชื่อของคุณ",
    "profile.email": "อีเมล",
    "profile.my_plugins": "ปลั๊กอินของฉัน",
    "profile.no_plugins": "ไม่พบ",
    "profile.upload_photo": "อัปโหลดรูปโปรไฟล์",
    "profile.drag_drop": "ลากไฟล์รูปมาวาง หรือ <span class='text-cyan-400'>คลิกเพื่อเลือกไฟล์</span>",
    "profile.supported_formats": "รองรับ JPG, PNG (ไม่เกิน 5MB)",
    
    // Plugin Detail Page
    "plugin.detail.features": "ฟีเจอร์หลัก",
    "plugin.detail.download": "ดาวน์โหลด",
    "plugin.detail.requirements": "ความต้องการระบบ",
    "plugin.detail.compatibility": "ความเข้ากันได้",
    "plugin.detail.reviews": "รีวิวจากผู้ใช้",
    
    // Checkout
    "checkout.title": "ชำระเงิน",
    "checkout.final_price": "ราคาสุดท้าย",
    "checkout.current_currency": "สกุลเงินปัจจุบัน",
    "checkout.purchase": "ซื้อเลย",
    "checkout.processing": "กำลังดำเนินการ...",
    "checkout.secure": "การชำระเงินปลอดภัยด้วย Stripe",
  },
  en: {
    // Header & Navigation
    "header.home": "Home",
    "header.plugins": "Plugins",
    "header.pricing": "Pricing",
    "header.support": "Support",
    "header.profile": "Profile",
    
    // Profile Menu
    "profile.settings": "Account Settings",
    "profile.language": "Language",
    "profile.currency": "Currency",
    "profile.signout": "Sign Out",
    
    // Common
    "common.buy": "Buy Now",
    "common.free": "FREE",
    "common.download": "Download Free",
    "common.download_now": "Download Now",
    "common.try_demo": "Try Free Demo",
    "common.thb": "THB",
    "common.usd": "USD",
    "common.price": "Price",
    "common.contact": "Contact",
    "common.learn_more": "Learn More",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    
    // Home Page
    "home.hero.title": "Professional Studio-grade Audio Plugins",
    "home.hero.subtitle": "For Modern Music Producers",
    "home.hero.cta": "Browse All Plugins",
    "home.features.title": "Why Choose Crystal Lab?",
    "home.features.studio": "Studio Quality",
    "home.features.studio.desc": "Sound designed and tested by professional audio engineers",
    "home.features.compatible": "Works with Any DAW",
    "home.features.compatible.desc": "Compatible with Pro Tools, Logic, Ableton and other major DAWs",
    "home.features.license": "Lifetime License",
    "home.features.license.desc": "Buy once, use forever with free lifetime updates",
    "home.cta.title": "Ready to Craft Your Sound?",
    "home.cta.button": "Get Started Free",
    
    // Pricing Page
    "pricing.title": "Pricing",
    "pricing.subtitle": "Choose the plan that's right for you",
    "pricing.free": "Free",
    "pricing.free.desc": "For beginners",
    "pricing.pro": "Professional",
    "pricing.pro.desc": "For studios",
    "pricing.bundle": "Bundle",
    "pricing.bundle.desc": "Best value",
    "pricing.features": "All Features Included",
    "pricing.license": "Lifetime License",
    "pricing.updates": "Free Updates",
    "pricing.support": "Priority Support",
    "pricing.money_back": "30-Day Money Back",
    
    // Support Page
    "support.title": "Support Center",
    "support.subtitle": "We're here to help you 24/7",
    "support.livechat": "Live Chat",
    "support.email": "Email",
    "support.faq": "Frequently Asked Questions",
    "support.notfound": "Still can't find what you need?",
    "support.startchat": "Start Chat with Team",
    "support.faq.license": "When will I receive my license after purchase?",
    "support.faq.compatible": "Which DAWs are compatible with your plugins?",
    "support.faq.refund": "Can I get a refund?",
    "support.faq.password": "What if I forgot my password?",
    "support.faq.devices": "How many devices can I use with one license?",
    "support.faq.trial": "Is there a free trial version?",
    
    // Plugins Page
    "plugins.title": "Plugins",
    "plugins.subtitle": "Studio-grade audio plugins for modern producers",
    "plugins.drop_tune.desc": "Free pitch-tuning plugin for Guitar, Bass, and Keyboard with warm analog gear character",
    "plugins.stem_splitter.desc": "AI-powered high-precision stem separation, splitting up to 10 tracks from Vocals to Strings",
    "plugins.analog_eq.desc": "Classic 7-band knob-style Graphic EQ with built-in Gate and Compressor, designed for Guitar & Bass",
    "plugins.compatibility": "Works with Pro Tools, Logic, Ableton",
    "plugins.requirements": "MacOS Ventura or later",
    "plugins.formats": "AU, VST3, AAX formats",
    
    // Profile Page
    "profile.title": "My Profile",
    "profile.account": "Account Information",
    "profile.name": "Display Name",
    "profile.enter_name": "Enter your name",
    "profile.email": "Email",
    "profile.my_plugins": "My Plugins",
    "profile.no_plugins": "None found",
    "profile.upload_photo": "Upload Profile Photo",
    "profile.drag_drop": "Drag & drop image or <span class='text-cyan-400'>click to browse</span>",
    "profile.supported_formats": "Supports JPG, PNG (max 5MB)",
    
    // Plugin Detail Page
    "plugin.detail.features": "Key Features",
    "plugin.detail.download": "Download",
    "plugin.detail.requirements": "System Requirements",
    "plugin.detail.compatibility": "Compatibility",
    "plugin.detail.reviews": "User Reviews",
    
    // Checkout
    "checkout.title": "Checkout",
    "checkout.final_price": "Final Price",
    "checkout.current_currency": "Current Currency",
    "checkout.purchase": "Purchase Now",
    "checkout.processing": "Processing...",
    "checkout.secure": "Secure payment powered by Stripe",
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th");
  const [currency, setCurrencyState] = useState<Currency>("THB");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    const savedCurrency = localStorage.getItem("currency") as Currency | null;

    const initialLang = savedLang === "th" || savedLang === "en" ? savedLang : "th";
    setLanguageState(initialLang);

    if (savedCurrency === "THB" || savedCurrency === "USD") {
      setCurrencyState(savedCurrency);
    } else {
      setCurrencyState(initialLang === "en" ? "USD" : "THB");
    }

    setMounted(true);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    const defaultCurrency: Currency = lang === "en" ? "USD" : "THB";
    setCurrencyState(defaultCurrency);
    localStorage.setItem("currency", defaultCurrency);
  }

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