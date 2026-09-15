"use client";

import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function EULAPage() {
  const { language } = useApp();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          ← {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          {language === "th" ? "ข้อตกลงใบอนุญาตผู้ใช้ขั้นสุดท้าย" : "End User License Agreement (EULA)"}
        </h1>

        <div className="prose prose-invert max-w-none space-y-8">
          {language === "th" ? (
            // ภาษาไทย (สรุป)
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">ประกาศสำคัญ</h2>
                <p className="text-gray-300">
                  เอกสารนี้เป็นฉบับย่อภาษาไทยของ End User License Agreement (EULA) 
                  สำหรับการใช้งานที่ง่ายต่อความเข้าใจ แต่ไม่มีผลผูกพันทางกฎหมาย 
                  ข้อตกลงฉบับเต็มที่มีผลผูกพันทางกฎหมายเป็นภาษาอังกฤษเท่านั้น 
                  กรุณาอ่านเอกสารฉบับภาษาอังกฤษด้านล่างสำหรับข้อตกลงที่แท้จริง
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">สรุปข้อตกลง (ภาษาไทย)</h2>
                <div className="space-y-4 text-gray-400">
                  <p><strong>1. การให้สิทธิ์ใช้งาน:</strong> คุณได้รับสิทธิ์ในการติดตั้งและใช้งานซอฟต์แวร์ 
                  บนคอมพิวเตอร์ส่วนบุคคลของคุณเท่านั้น สำหรับการผลิตดนตรีและงานเสียงส่วนตัวหรือเชิงพาณิชย์</p>
                  
                  <p><strong>2. การห้ามทำ:</strong> ห้ามคัดลอก แก้ไข แปลง หรือแจกจ่ายซอฟต์แวร์ 
                  ห้ามย้อนกระบวนการวิศวกรรม หรือใช้ซอฟต์แวร์บนเซิร์ฟเวอร์หรือเครือข่าย</p>
                  
                  <p><strong>3. สิทธิ์ในทรัพย์สินทางปัญญา:</strong> ซอฟต์แวร์เป็นทรัพย์สินทางปัญญาของ Crystal Labolatories 
                  คุณได้รับเพียงสิทธิ์ใช้งาน (license) ไม่ใช่ความเป็นเจ้าของ</p>
                  
                  <p><strong>4. การรับประกันและการจำกัดความรับผิด:</strong> ซอฟต์แวร์ให้บริการ "ตามสภาพที่มีอยู่" 
                  (AS-IS) โดยไม่มีการรับประกัน Crystal Lab จะไม่รับผิดต่อความเสียหายใดๆ ที่เกิดขึ้นจากการใช้งาน</p>
                  
                  <p><strong>5. การสิ้นสุดข้อตกลง:</strong> ข้อตกลงนี้สิ้นสุดลงเมื่อคุณหยุดใช้งานซอฟต์แวร์ 
                  หรือเมื่อมีการฝ่าฝืนข้อตกลงนี้</p>
                </div>
              </section>

              <div className="bg-amber-900/20 border border-amber-700 rounded-xl p-6 my-8">
                <h3 className="font-semibold mb-3 text-amber-300">⚠️ ข้อตกลงที่มีผลผูกพันทางกฎหมาย</h3>
                <p className="text-gray-300">
                  เอกสารภาษาอังกฤษด้านล่างนี้คือ End User License Agreement (EULA) 
                  ฉบับเต็มที่มีผลผูกพันทางกฎหมายตามกฎหมายระหว่างประเทศ
                </p>
              </div>
            </>
          ) : null}

          {/* English EULA (Full Legal Document) */}
          <div className={language === "th" ? "border-t border-gray-800 pt-8 mt-8" : ""}>
            {language === "th" && (
              <h2 className="text-2xl font-bold mb-6 text-white">English EULA (Full Legal Document)</h2>
            )}
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-300">END USER LICENSE AGREEMENT</h2>
              <p className="text-gray-300 font-semibold">
                CRYSTAL LABOLATORIES CO., LTD. - SOFTWARE LICENSE AGREEMENT
              </p>
              <p className="text-gray-400 mt-2">
                Version 3.1 | Effective Date: September 15, 2026
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">1. DEFINITIONS</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>1.1 "Software"</strong> means the Crystal Lab audio plugin(s), including any updates, upgrades, modifications, and associated documentation.</p>
                  <p><strong>1.2 "License"</strong> means the rights granted to you under this Agreement.</p>
                  <p><strong>1.3 "Effective Date"</strong> means the date you first install or use the Software.</p>
                  <p><strong>1.4 "Authorized User"</strong> means you, the individual who has purchased or otherwise rightfully obtained the Software.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">2. GRANT OF LICENSE</h3>
                <div className="space-y-3 text-gray-400">
                  <p><strong>2.1 Limited License Grant.</strong> Subject to the terms of this Agreement, Crystal Labolatories grants you a non-exclusive, non-transferable, limited license to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Install and use the Software on up to two (2) computers that you own or control;</li>
                    <li>Use the Software for personal or commercial audio production;</li>
                    <li>Make one (1) backup copy of the Software for archival purposes.</li>
                  </ul>
                  
                  <p><strong>2.2 License Types.</strong> The specific license type you purchase determines your rights:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Perpetual License:</strong> Grants lifetime use of the purchased version with updates for one (1) year from purchase;</li>
                    <li><strong>Subscription License:</strong> Grants use rights for the subscription period with access to all updates during active subscription;</li>
                    <li><strong>Free License:</strong> Grants use rights for the free version as provided, with limited functionality.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">3. RESTRICTIONS</h3>
                <div className="space-y-2 text-gray-400">
                  <p>You may NOT:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Copy, modify, adapt, translate, or create derivative works of the Software;</li>
                    <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code;</li>
                    <li>Remove, alter, or obscure any proprietary notices or labels;</li>
                    <li>Rent, lease, lend, sell, sublicense, or commercially exploit the Software;</li>
                    <li>Use the Software for any illegal purpose or in violation of any laws;</li>
                    <li>Transfer the Software to any third party without prior written consent;</li>
                    <li>Use the Software on more than the authorized number of computers;</li>
                    <li>Bypass any license key mechanism or copy protection.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">4. INTELLECTUAL PROPERTY RIGHTS</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>4.1 Ownership.</strong> The Software is licensed, not sold. Crystal Labolatories retains all right, title, and interest in and to the Software, including all intellectual property rights.</p>
                  <p><strong>4.2 Feedback.</strong> Any feedback, suggestions, or ideas you provide regarding the Software may be used by Crystal Labolatories without compensation or attribution.</p>
                  <p><strong>4.3 Trademarks.</strong> "Crystal Lab", the Crystal Lab logo, and all related names are trademarks of Crystal Labolatories. You may not use these marks without express written permission.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">5. PAYMENT AND TAXES</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>5.1 Fees.</strong> You agree to pay all fees associated with your purchase or subscription.</p>
                  <p><strong>5.2 Taxes.</strong> You are responsible for all applicable sales, use, VAT, or other taxes, except for taxes on Crystal Labolatories' net income.</p>
                  <p><strong>5.3 Refunds.</strong> Due to the digital nature of the Software, all sales are final except where required by applicable law.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">6. WARRANTY DISCLAIMER</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>6.1 "AS IS".</strong> THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</p>
                  <p><strong>6.2 No Warranties.</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CRYSTAL LABOLATORIES DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                  <p><strong>6.3 Compatibility.</strong> Crystal Labolatories does not warrant that the Software will be compatible with all hardware, operating systems, or third-party software.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">7. LIMITATION OF LIABILITY</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>7.1 No Consequential Damages.</strong> IN NO EVENT SHALL CRYSTAL LABOLATORIES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SOFTWARE.</p>
                  <p><strong>7.2 Cap on Liability.</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, CRYSTAL LABOLATORIES' TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
                  <p><strong>7.3 Essential Basis.</strong> THE LIMITATIONS IN THIS SECTION ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN BETWEEN YOU AND CRYSTAL LABOLATORIES.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">8. TERM AND TERMINATION</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>8.1 Term.</strong> This Agreement is effective from the Effective Date until terminated.</p>
                  <p><strong>8.2 Termination by You.</strong> You may terminate this Agreement by ceasing all use of the Software and destroying all copies.</p>
                  <p><strong>8.3 Termination by Crystal Lab.</strong> Crystal Labolatories may terminate this Agreement if you breach any terms. Upon termination, you must cease all use and destroy all copies of the Software.</p>
                  <p><strong>8.4 Survival.</strong> Sections 3, 4, 6, 7, 9, and 10 shall survive termination.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">9. EXPORT CONTROL</h3>
                <p className="text-gray-400">
                  You agree not to export or re-export the Software in violation of any export control laws of Thailand, the United States, the European Union, or other applicable jurisdictions.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">10. GOVERNING LAW AND DISPUTE RESOLUTION</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>10.1 Governing Law.</strong> This Agreement shall be governed by and construed in accordance with the laws of Thailand, without regard to its conflict of laws principles.</p>
                  <p><strong>10.2 Dispute Resolution.</strong> Any disputes shall be resolved through binding arbitration in Bangkok, Thailand, in accordance with the rules of the Thai Arbitration Institute.</p>
                  <p><strong>10.3 Class Action Waiver.</strong> YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">11. GENERAL PROVISIONS</h3>
                <div className="space-y-2 text-gray-400">
                  <p><strong>11.1 Entire Agreement.</strong> This Agreement constitutes the entire agreement between you and Crystal Labolatories regarding the Software.</p>
                  <p><strong>11.2 Amendments.</strong> Crystal Labolatories may modify this Agreement at any time by posting the revised version on its website.</p>
                  <p><strong>11.3 Severability.</strong> If any provision is found invalid or unenforceable, the remaining provisions will remain in full force.</p>
                  <p><strong>11.4 Assignment.</strong> You may not assign this Agreement without prior written consent. Crystal Labolatories may assign this Agreement without restriction.</p>
                  <p><strong>11.5 Force Majeure.</strong> Neither party shall be liable for delays caused by circumstances beyond reasonable control.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-white">12. CONTACT INFORMATION</h3>
                <div className="space-y-2 text-gray-400">
                  <p>For questions about this EULA or to report violations:</p>
                  <p><strong>Crystal Labolatories Co., Ltd.</strong></p>
                  <p>123 Crystal Tower, Sukhumvit, Bangkok 10110, Thailand</p>
                  <p><strong>Email:</strong> legal@crystallab.com</p>
                  <p><strong>Phone:</strong> +66 (0) 2 123 4567</p>
                </div>
              </section>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
                <h3 className="font-semibold mb-3 text-white">ACCEPTANCE</h3>
                <p className="text-gray-400">
                  BY INSTALLING OR USING THE SOFTWARE, YOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT, UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS. IF YOU DO NOT AGREE, DO NOT INSTALL OR USE THE SOFTWARE.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p><strong>Last Updated:</strong> September 15, 2026</p>
                  <p><strong>Effective Date:</strong> September 15, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}