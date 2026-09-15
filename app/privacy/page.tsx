"use client";

import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function PrivacyPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          ← {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          {language === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Notice"}
        </h1>

        <div className="prose prose-invert max-w-none space-y-8">
          {language === "th" ? (
            // ภาษาไทย - เขียนตาม PDPA
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">ประกาศนโยบายความเป็นส่วนตัว</h2>
                <p className="text-gray-300">
                  บริษัท คริสตัล แล็บโอราทอรีส์ จำกัด ("เรา", "บริษัท", "Crystal Labolatories") 
                  ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                  นโยบายนี้อธิบายวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณ
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">1. ข้อมูลส่วนบุคคลที่เรารวบรวม</h2>
                <div className="space-y-3 text-gray-400">
                  <p><strong>1.1 ข้อมูลที่คุณให้โดยตรง:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>ข้อมูลบัญชีผู้ใช้ (ชื่อ, อีเมล, รหัสผ่าน)</li>
                    <li>ข้อมูลการชำระเงิน (ที่อยู่ใบแจ้งหนี้, ข้อมูลบัตรเครดิตผ่าน Stripe)</li>
                    <li>ข้อมูลการติดต่อ (เบอร์โทรศัพท์, ที่อยู่จัดส่ง)</li>
                    <li>ข้อมูลโปรไฟล์ (รูปภาพโปรไฟล์, ชื่อที่แสดง)</li>
                  </ul>
                  
                  <p><strong>1.2 ข้อมูลที่รวบรวมโดยอัตโนมัติ:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>ข้อมูลอุปกรณ์ (ประเภทอุปกรณ์, ระบบปฏิบัติการ, เวอร์ชันเบราว์เซอร์)</li>
                    <li>ข้อมูลการใช้งาน (หน้าที่เยี่ยมชม, ระยะเวลาใช้งาน, การคลิก)</li>
                    <li>ข้อมูลโลเคชัน (ประเทศ, ภาษา, โซนเวลา)</li>
                    <li>ข้อมูลเทคนิค (IP Address, Cookie ID, Session ID)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">2. วัตถุประสงค์ในการประมวลผลข้อมูล</h2>
                <div className="space-y-3 text-gray-400">
                  <p>เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>ให้บริการซอฟต์แวร์ปลั๊กอินและแพลตฟอร์ม Crystal Access</li>
                    <li>จัดการบัญชีผู้ใช้และการชำระเงิน</li>
                    <li>ส่งข้อมูลอัปเดตโปรดักส์และข่าวสารทางการตลาด</li>
                    <li>พัฒนาปรับปรุงคุณภาพบริการ</li>
                    <li>ปฏิบัติตามข้อกำหนดกฎหมายและระเบียบข้อบังคับ</li>
                    <li>ป้องกันการฉ้อโกงและกิจกรรมที่ผิดกฎหมาย</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">3. การเปิดเผยข้อมูลส่วนบุคคล</h2>
                <div className="space-y-3 text-gray-400">
                  <p>เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณให้กับ:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>ผู้ให้บริการ:</strong> Stripe (การชำระเงิน), Vercel (โฮสติ้ง), Supabase (ฐานข้อมูล)</li>
                    <li><strong>หน่วยงานรัฐ:</strong> เมื่อมีข้อเรียกร้องตามกฎหมาย</li>
                    <li><strong>ที่ปรึกษากฎหมาย:</strong> เพื่อวัตถุประสงค์ทางกฎหมาย</li>
                  </ul>
                  <p className="mt-2">
                    เราจะไม่ขาย แลกเปลี่ยน หรือโอนข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม 
                    เพื่อวัตถุประสงค์ทางการค้าโดยไม่ได้รับความยินยอมจากคุณ
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">4. สิทธิ์ของคุณตาม PDPA</h2>
                <div className="space-y-3 text-gray-400">
                  <p>คุณมีสิทธิ์:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>สิทธิ์ขอเข้าถึงข้อมูล:</strong> ขอรับสำเนาข้อมูลส่วนบุคคลของคุณ</li>
                    <li><strong>สิทธิ์ขอแก้ไขข้อมูล:</strong> แก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้อง</li>
                    <li><strong>สิทธิ์ขอลบข้อมูล:</strong> ลบข้อมูลส่วนบุคคลเมื่อสิ้นสุดความจำเป็น</li>
                    <li><strong>สิทธิ์ขอระงับการใช้ข้อมูล:</strong> หยุดการใช้ข้อมูลชั่วคราว</li>
                    <li><strong>สิทธิ์คัดค้าน:</strong> คัดค้านการประมวลผลข้อมูลเพื่อการตลาด</li>
                    <li><strong>สิทธิ์ขอโอนข้อมูล:</strong> ขอรับข้อมูลในรูปแบบที่อ่านได้ด้วยเครื่อง</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">5. การเก็บรักษาข้อมูล</h2>
                <p className="text-gray-400">
                  เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตามระยะเวลาที่จำเป็นเพื่อให้บรรลุวัตถุประสงค์
                  ที่ระบุในนโยบายนี้ หรือตามที่กฎหมายกำหนด โดยทั่วไปเราจะเก็บข้อมูล:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
                  <li>ข้อมูลบัญชีผู้ใช้: จนกว่าบัญชีจะถูกปิด</li>
                  <li>ข้อมูลการชำระเงิน: 10 ปี ตามกฎหมายภาษี</li>
                  <li>ข้อมูลการใช้งาน: 2 ปี</li>
                  <li>ข้อมูลการติดต่อสื่อสาร: 3 ปี</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">6. การรักษาความปลอดภัย</h2>
                <p className="text-gray-400">
                  เราดำเนินมาตรการรักษาความปลอดภัยทั้งทางเทคนิคและทางองค์กรที่เหมาะสม 
                  เพื่อป้องกันการสูญหาย การเข้าถึง การใช้ การเปลี่ยนแปลง การเปิดเผย 
                  หรือการทำลายข้อมูลส่วนบุคคลของคุณโดยไม่ได้รับอนุญาต
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">7. การเปลี่ยนแปลงนโยบาย</h2>
                <p className="text-gray-400">
                  เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว 
                  เราจะประกาศการเปลี่ยนแปลงบนหน้านี้และอัปเดตวันที่ "ปรับปรุงล่าสุด" 
                  เราขอแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะ
                </p>
              </section>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
                <h3 className="font-semibold mb-3 text-white">การติดต่อ</h3>
                <p className="text-gray-400">
                  หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิ์ตาม PDPA 
                  กรุณาติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเรา:
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-300"><strong>อีเมล:</strong> dpo@crystallab.com</p>
                  <p className="text-gray-300"><strong>โทรศัพท์:</strong> +66 (0) 2 123 4567</p>
                  <p className="text-gray-300"><strong>ที่อยู่:</strong> 123 Crystal Tower, สุขุมวิท, กรุงเทพฯ 10110</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
                <p><strong>ปรับปรุงล่าสุด:</strong> 15 กันยายน 2569</p>
                <p><strong>ประกาศใช้:</strong> 15 กันยายน 2569</p>
              </div>
            </>
          ) : (
            // English version
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Privacy Notice</h2>
                <p className="text-gray-300">
                  Crystal Labolatories Co., Ltd. ("we", "our", "Crystal Lab") values your privacy 
                  and is committed to protecting your personal data in accordance with applicable data 
                  protection laws, including Thailand's Personal Data Protection Act B.E. 2562 (2019).
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">1. Personal Data We Collect</h2>
                <div className="space-y-3 text-gray-400">
                  <p><strong>1.1 Information you provide directly:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Account information (name, email, password)</li>
                    <li>Payment information (billing address, credit card details via Stripe)</li>
                    <li>Contact information (phone number, shipping address)</li>
                    <li>Profile information (profile picture, display name)</li>
                  </ul>
                  
                  <p><strong>1.2 Automatically collected information:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Device information (device type, OS, browser version)</li>
                    <li>Usage data (pages visited, session duration, clicks)</li>
                    <li>Location data (country, language, timezone)</li>
                    <li>Technical data (IP address, Cookie ID, Session ID)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">2. Purpose of Data Processing</h2>
                <div className="space-y-3 text-gray-400">
                  <p>We use your personal data to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide software plugins and Crystal Access platform services</li>
                    <li>Manage user accounts and process payments</li>
                    <li>Send product updates and marketing communications</li>
                    <li>Improve and develop our services</li>
                    <li>Comply with legal and regulatory requirements</li>
                    <li>Prevent fraud and illegal activities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">3. Disclosure of Personal Data</h2>
                <div className="space-y-3 text-gray-400">
                  <p>We may disclose your personal data to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Service Providers:</strong> Stripe (payments), Vercel (hosting), Supabase (database)</li>
                    <li><strong>Government Authorities:</strong> When required by law</li>
                    <li><strong>Legal Advisors:</strong> For legal purposes</li>
                  </ul>
                  <p className="mt-2">
                    We will not sell, exchange, or transfer your personal data to third parties 
                    for commercial purposes without your consent.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">4. Your Rights Under PDPA</h2>
                <div className="space-y-3 text-gray-400">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                    <li><strong>Erasure:</strong> Delete personal data when no longer necessary</li>
                    <li><strong>Restriction:</strong> Temporarily suspend processing</li>
                    <li><strong>Objection:</strong> Object to processing for marketing</li>
                    <li><strong>Portability:</strong> Receive data in machine-readable format</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">5. Data Retention</h2>
                <p className="text-gray-400">
                  We retain your personal data only as long as necessary for the purposes 
                  stated in this policy or as required by law. Generally:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
                  <li>Account data: Until account closure</li>
                  <li>Payment data: 10 years for tax purposes</li>
                  <li>Usage data: 2 years</li>
                  <li>Communication data: 3 years</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">6. Security Measures</h2>
                <p className="text-gray-400">
                  We implement appropriate technical and organizational security measures 
                  to protect your personal data against loss, unauthorized access, use, 
                  alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">7. Policy Changes</h2>
                <p className="text-gray-400">
                  We may update this Privacy Notice periodically. We will post changes 
                  on this page and update the "Last Updated" date. We encourage you to 
                  review this page regularly.
                </p>
              </section>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
                <h3 className="font-semibold mb-3 text-white">Contact Information</h3>
                <p className="text-gray-400">
                  If you have questions about this Privacy Notice or wish to exercise your rights under PDPA, 
                  please contact our Data Protection Officer:
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-300"><strong>Email:</strong> dpo@crystallab.com</p>
                  <p className="text-gray-300"><strong>Phone:</strong> +66 (0) 2 123 4567</p>
                  <p className="text-gray-300"><strong>Address:</strong> 123 Crystal Tower, Sukhumvit, Bangkok 10110</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
                <p><strong>Last Updated:</strong> September 15, 2026</p>
                <p><strong>Effective Date:</strong> September 15, 2026</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}