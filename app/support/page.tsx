"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "ซื้อปลั๊กอินแล้วได้รับ License ตอนไหน?",
    answer: "หลังจากชำระเงินสำเร็จ ระบบจะส่ง License Key ไปยังอีเมลที่ใช้ตอนชำระเงินภายใน 5 นาที กรุณาเช็คในกล่องจดหมายขยะ (Spam) ด้วยหากไม่พบ",
  },
  {
    question: "ปลั๊กอินใช้งานร่วมกับ DAW อะไรได้บ้าง?",
    answer: "ปลั๊กอินของเรารองรับ Pro Tools 2023+, Logic Pro X, Ableton Live 11+ และ DAW อื่นๆ ที่รองรับ AU, VST3, AAX formats",
  },
  {
    question: "ขอคืนเงินได้ไหม?",
    answer: "สามารถขอคืนเงินได้ภายใน 30 วันหลังการซื้อ หากปลั๊กอินมีปัญหาทางเทคนิคที่แก้ไขไม่ได้ กรุณาติดต่อทีมงานผ่าน Live Chat หรืออีเมล support@crystallab.com",
  },
  {
    question: "ลืมรหัสผ่านทำอย่างไร?",
    answer: "ไปที่หน้า Login แล้วกด 'ลืมรหัสผ่าน' ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ",
  },
  {
    question: "ใช้ License เดียวได้กี่เครื่อง?",
    answer: "License 1 ชุดสามารถใช้งานได้สูงสุด 2 เครื่องต่อบัญชี (เช่น เครื่องที่บ้านและที่สตูดิโอ)",
  },
  {
    question: "มีเวอร์ชันทดลองใช้ฟรีไหม?",
    answer: "มีครับ ทุกปลั๊กอินแบบเสียเงินมีเวอร์ชันทดลองใช้ฟรี 14 วัน สามารถดาวน์โหลดได้จากหน้ารายละเอียดปลั๊กอินแต่ละตัว",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            ศูนย์ช่วยเหลือ <span className="text-cyan-400">Support</span>
          </h1>
          <p className="text-gray-400">
            มีคำถาม? เราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-400 text-sm">
              คลิกไอคอนแชทมุมขวาล่าง เพื่อคุยกับทีมงานสด
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold mb-2">อีเมล</h3>
            <p className="text-gray-400 text-sm">support@crystallab.com</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-semibold mb-2">เวลาทำการ</h3>
            <p className="text-gray-400 text-sm">จันทร์-ศุกร์ 9:00-18:00 น.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            คำถามที่พบบ่อย <span className="text-cyan-400">(FAQ)</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span
                    className={`text-cyan-400 text-xl transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">ยังไม่พบคำตอบที่ต้องการ?</p>
          <button className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg transition-colors">
            💬 เริ่มแชทกับทีมงาน
          </button>
        </div>
      </div>
    </main>
  );
}