"use client";

import { useState } from "react";
import { useApp } from "@/app/context/AppContext";

const faqKeys = [
  "support.faq.license",
  "support.faq.compatible",
  "support.faq.refund",
  "support.faq.password",
  "support.faq.devices",
  "support.faq.trial",
];

const faqAnswers = {
  th: [
    "หลังจากชำระเงินสำเร็จ ระบบจะส่ง License Key ไปยังอีเมลที่ใช้ตอนชำระเงินภายใน 5 นาที กรุณาเช็คในกล่องจดหมายขยะ (Spam) ด้วยหากไม่พบ",
    "ปลั๊กอินของเรารองรับ Pro Tools 2023+, Logic Pro X, Ableton Live 11+ และ DAW อื่นๆ ที่รองรับ AU, VST3, AAX formats",
    "สามารถขอคืนเงินได้ภายใน 30 วันหลังการซื้อ หากปลั๊กอินมีปัญหาทางเทคนิคที่แก้ไขไม่ได้ กรุณาติดต่อทีมงานผ่าน Live Chat หรืออีเมล support@crystallab.com",
    "ไปที่หน้า Login แล้วกด 'ลืมรหัสผ่าน' ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ",
    "License 1 ชุดสามารถใช้งานได้สูงสุด 2 เครื่องต่อบัญชี (เช่น เครื่องที่บ้านและที่สตูดิโอ)",
    "มีครับ ทุกปลั๊กอินแบบเสียเงินมีเวอร์ชันทดลองใช้ฟรี 14 วัน สามารถดาวน์โหลดได้จากหน้ารายละเอียดปลั๊กอินแต่ละตัว",
  ],
  en: [
    "Your license key will be sent to your email within 5 minutes after successful payment. Please check your spam folder if you don't see it.",
    "Our plugins support Pro Tools 2023+, Logic Pro X, Ableton Live 11+, and other DAWs that support AU, VST3, AAX formats.",
    "You can request a refund within 30 days of purchase if the plugin has technical issues that cannot be resolved. Please contact our team via Live Chat or email support@crystallab.com.",
    "Go to the Login page and click 'Forgot Password'. A password reset link will be sent to your email.",
    "One license can be activated on up to 2 devices per account (e.g., home computer and studio computer).",
    "Yes! All paid plugins have a free 14-day trial version. You can download it from each plugin's detail page.",
  ],
};

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language, t } = useApp();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t("support.title")} <span className="text-cyan-400">Support</span>
          </h1>
          <p className="text-gray-400">{t("support.subtitle")}</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold mb-2 text-lg">{t("support.livechat")}</h3>
            <p className="text-gray-400 mb-4">
              {language === "th" 
                ? "คลิกไอคอนแชทมุมขวาล่าง เพื่อคุยกับทีมงานสด"
                : "Click the chat icon in the bottom right to chat live with our team"}
            </p>
            <div className="text-xs text-cyan-400">
              {language === "th" ? "ตอบกลับทันที 24/7" : "Instant reply 24/7"}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold mb-2 text-lg">{t("support.email")}</h3>
            <p className="text-gray-400 mb-4">support@crystallab.com</p>
            <div className="text-xs text-cyan-400">
              {language === "th" ? "ตอบกลับภายใน 24 ชั่วโมง" : "Reply within 24 hours"}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {t("support.faq")} <span className="text-cyan-400">(FAQ)</span>
          </h2>

          <div className="space-y-3">
            {faqKeys.map((questionKey, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium">{t(questionKey)}</span>
                  <span className={`text-cyan-400 text-xl transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-gray-400 leading-relaxed">
                    {faqAnswers[language][index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">{t("support.notfound")}</p>
          <button className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            💬 {t("support.startchat")}
          </button>
        </div>
      </div>
    </main>
  );
}