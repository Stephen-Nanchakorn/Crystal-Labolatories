"use client";

import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function TermsPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          ← {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          {language === "th" ? "ข้อกำหนดการใช้งาน" : "Terms of Use"}
        </h1>

        <div className="prose prose-invert max-w-none space-y-6">
          {language === "th" ? (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. การยอมรับข้อกำหนด</h2>
                <p className="text-gray-400">
                  โดยการเข้าใช้งานเว็บไซต์ Crystal Lab (https://crystal-labolatories-zc28.vercel.app) 
                  และบริการต่างๆ ของเรา คุณตกลงที่จะปฏิบัติตามและอยู่ภายใต้ข้อกำหนดและเงื่อนไขการใช้งานฉบับนี้ 
                  หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณาอย่าใช้งานเว็บไซต์และบริการของเรา
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. การให้บริการ</h2>
                <p className="text-gray-400">
                  Crystal Lab ให้บริการซอฟต์แวร์ปลั๊กอินเสียงสำหรับการผลิตดนตรีดิจิทัล 
                  การใช้งานซอฟต์แวร์ต้องอยู่ภายใต้ข้อตกลงใบอนุญาตผู้ใช้ขั้นสุดท้าย (EULA) 
                  ที่ให้มาพร้อมกับซอฟต์แวร์แต่ละตัว
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. สิทธิ์ในทรัพย์สินทางปัญญา</h2>
                <p className="text-gray-400">
                  ซอฟต์แวร์ โลโก้ การออกแบบ กราฟิก และเนื้อหาทั้งหมดบนเว็บไซต์นี้ 
                  เป็นทรัพย์สินทางปัญญาของ Crystal Labolatories และได้รับการคุ้มครอง 
                  ตามกฎหมายลิขสิทธิ์และกฎหมายทรัพย์สินทางปัญญาอื่นๆ
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. การรับประกันและการจำกัดความรับผิด</h2>
                <p className="text-gray-400">
                  บริการให้ตามสภาพที่มีอยู่ (AS-IS) โดยไม่มีการรับประกันใดๆ 
                  ทั้งโดยชัดแจ้งหรือโดยนัย Crystal Lab จะไม่รับผิดชอบต่อความเสียหายใดๆ 
                  ที่เกิดขึ้นจากการใช้งานหรือไม่สามารถใช้งานบริการได้
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. การแก้ไขข้อกำหนด</h2>
                <p className="text-gray-400">
                  เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดการใช้งานนี้ได้ทุกเมื่อ 
                  โดยจะประกาศการเปลี่ยนแปลงบนหน้านี้ การใช้งานต่อเนื่องหลังจากการเปลี่ยนแปลง 
                  ถือเป็นการยอมรับข้อกำหนดฉบับแก้ไข
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. กฎหมายที่ใช้บังคับ</h2>
                <p className="text-gray-400">
                  ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย และศาลที่มีเขตอำนาจในกรุงเทพมหานคร 
                  จะมีอำนาจพิจารณาคดีใดๆ ที่เกี่ยวข้อง
                </p>
              </section>

              <div className="text-gray-500 text-sm mt-8">
                <p>ปรับปรุงล่าสุด: 15 กันยายน 2026</p>
                <p>หากมีคำถามเกี่ยวกับข้อกำหนดการใช้งาน กรุณาติดต่อ: legal@crystallab.com</p>
              </div>
            </>
          ) : (
            // English version
            <>
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-400">
                  By accessing the Crystal Lab website (https://crystal-labolatories-zc28.vercel.app) 
                  and our services, you agree to be bound by these Terms of Use. 
                  If you do not agree to any terms, please do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Services Provided</h2>
                <p className="text-gray-400">
                  Crystal Lab provides audio plugin software for digital music production. 
                  Use of the software is subject to the End User License Agreement (EULA) 
                  provided with each software product.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Intellectual Property Rights</h2>
                <p className="text-gray-400">
                  All software, logos, designs, graphics, and content on this website 
                  are intellectual property of Crystal Labolatories and are protected 
                  by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Warranty and Liability Limitation</h2>
                <p className="text-gray-400">
                  Services are provided "AS IS" without any warranties, express or implied. 
                  Crystal Lab shall not be liable for any damages arising from the use or 
                  inability to use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Modification of Terms</h2>
                <p className="text-gray-400">
                  We reserve the right to modify these Terms of Use at any time. 
                  Changes will be announced on this page. Continued use after changes 
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Governing Law</h2>
                <p className="text-gray-400">
                  These terms are governed by Thai law, and courts in Bangkok, Thailand 
                  shall have jurisdiction over any related disputes.
                </p>
              </section>

              <div className="text-gray-500 text-sm mt-8">
                <p>Last Updated: September 15, 2026</p>
                <p>For questions about these Terms, please contact: legal@crystallab.com</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}