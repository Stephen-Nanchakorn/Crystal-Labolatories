"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";

export default function CookiesPage() {
  const { language } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          ← {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          {language === "th" ? "นโยบายการใช้คุกกี้" : "Cookie Notice"}
        </h1>

        <div className="prose prose-invert max-w-none space-y-8">
          {language === "th" ? (
            // ภาษาไทย
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">ประกาศการใช้คุกกี้</h2>
                <p className="text-gray-300 mb-4">
                  เว็บไซต์ Crystal Lab ใช้คุกกี้ (Cookies) และเทคโนโลยีที่คล้ายคลึงกัน 
                  เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ การใช้คุกกี้ช่วยให้เรา:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>จดจำการตั้งค่าของคุณ</li>
                  <li>ปรับปรุงความปลอดภัยของเว็บไซต์</li>
                  <li>วิเคราะห์การใช้งานเพื่อพัฒนาบริการ</li>
                  <li>แสดงเนื้อหาที่ตรงกับความสนใจของคุณ</li>
                </ul>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">คุกกี้คืออะไร?</h2>
                <p className="text-gray-400">
                  คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกเก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเยี่ยมชมเว็บไซต์ 
                  คุกกี้ช่วยให้เว็บไซต์จดจำข้อมูลเกี่ยวกับการเยี่ยมชมของคุณ เช่น ภาษาที่เลือก 
                  การตั้งค่า การเข้าสู่ระบบ และข้อมูลอื่นๆ ที่ทำให้การใช้งานสะดวกขึ้น
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">ประเภทของคุกกี้ที่เราใช้</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">1. คุกกี้ที่จำเป็น (Strictly Necessary Cookies)</h3>
                    <p className="text-gray-400">
                      คุกกี้ประเภทนี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ 
                      เช่น การเข้าสู่ระบบ การรักษาความปลอดภัย การจำกัดการใช้งานที่ผิดปกติ
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>ตัวอย่าง:</strong> Session cookies, Authentication cookies</p>
                      <p><strong>อายุการใช้งาน:</strong> Session หรือ 24 ชั่วโมง</p>
                      <p><strong>สามารถปิดการใช้งานได้หรือไม่:</strong> ไม่ได้ (เว็บไซต์จะไม่ทำงาน)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">2. คุกกี้เพื่อประสิทธิภาพ (Performance Cookies)</h3>
                    <p className="text-gray-400">
                      คุกกี้ประเภทนี้ช่วยให้เราเข้าใจว่าผู้ใช้มีปฏิสัมพันธ์กับเว็บไซต์อย่างไร 
                      เช่น หน้าที่เยี่ยมชมบ่อย ข้อผิดพลาดที่เกิดขึ้น 
                      เพื่อให้เราสามารถปรับปรุงประสิทธิภาพของเว็บไซต์
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>ตัวอย่าง:</strong> Analytics cookies (Vercel Analytics)</p>
                      <p><strong>อายุการใช้งาน:</strong> 1-2 ปี</p>
                      <p><strong>สามารถปิดการใช้งานได้หรือไม่:</strong> ได้ (ผ่าน Cookie Banner)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">3. คุกกี้เพื่อหน้าที่ (Functional Cookies)</h3>
                    <p className="text-gray-400">
                      คุกกี้ประเภทนี้ช่วยให้เว็บไซต์จดจำการเลือกของคุณ เช่น ภาษา 
                      สกุลเงิน ภูมิภาค เพื่อให้คุณไม่ต้องตั้งค่าซ้ำทุกครั้งที่เยี่ยมชม
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>ตัวอย่าง:</strong> Language preference, Currency preference</p>
                      <p><strong>อายุการใช้งาน:</strong> 1 ปี</p>
                      <p><strong>สามารถปิดการใช้งานได้หรือไม่:</strong> ได้ (อาจส่งผลต่อประสบการณ์ใช้งาน)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">4. คุกกี้เพื่อการตลาด (Targeting/Advertising Cookies)</h3>
                    <p className="text-gray-400">
                      คุกกี้ประเภทนี้ใช้ติดตามพฤติกรรมการใช้งานเพื่อแสดงโฆษณา 
                      หรือเนื้อหาที่ตรงกับความสนใจของคุณ
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>ตัวอย่าง:</strong> Facebook Pixel, Google Analytics for ads</p>
                      <p><strong>อายุการใช้งาน:</strong> 90 วัน - 1 ปี</p>
                      <p><strong>สามารถปิดการใช้งานได้หรือไม่:</strong> ได้ (ผ่าน Cookie Banner)</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">รายละเอียดคุกกี้ทั้งหมด</h2>
                
                {!showDetails ? (
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    📋 คลิกเพื่อดูรายละเอียดคุกกี้ทั้งหมด
                  </button>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                      <thead>
                        <tr className="bg-gray-900">
                          <th className="border border-gray-700 p-3 text-left">ชื่อคุกกี้</th>
                          <th className="border border-gray-700 p-3 text-left">ประเภท</th>
                          <th className="border border-gray-700 p-3 text-left">ผู้ให้บริการ</th>
                          <th className="border border-gray-700 p-3 text-left">วัตถุประสงค์</th>
                          <th className="border border-gray-700 p-3 text-left">อายุ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border border-gray-800 hover:bg-gray-900/50">
                          <td className="border border-gray-800 p-3 font-mono">auth-token</td>
                          <td className="border border-gray-800 p-3">จำเป็น</td>
                          <td className="border border-gray-800 p-3">Crystal Lab</td>
                          <td className="border border-gray-800 p-3">การเข้าสู่ระบบและความปลอดภัย</td>
                          <td className="border border-gray-800 p-3">24 ชั่วโมง</td>
                        </tr>
                        <tr className="border border-gray-800 hover:bg-gray-900/50">
                          <td className="border border-gray-800 p-3 font-mono">language</td>
                          <td className="border border-gray-800 p-3">หน้าที่</td>
                          <td className="border border-gray-800 p-3">Crystal Lab</td>
                          <td className="border border-gray-800 p-3">เก็บค่าภาษาที่เลือก</td>
                          <td className="border border-gray-800 p-3">1 ปี</td>
                        </tr>
                        <tr className="border border-gray-800 hover:bg-gray-900/50">
                          <td className="border border-gray-800 p-3 font-mono">currency</td>
                          <td className="border border-gray-800 p-3">หน้าที่</td>
                          <td className="border border-gray-800 p-3">Crystal Lab</td>
                          <td className="border border-gray-800 p-3">เก็บค่าสกุลเงินที่เลือก</td>
                          <td className="border border-gray-800 p-3">1 ปี</td>
                        </tr>
                        <tr className="border border-gray-800 hover:bg-gray-900/50">
                          <td className="border border-gray-800 p-3 font-mono">_vercel_analytics</td>
                          <td className="border border-gray-800 p-3">ประสิทธิภาพ</td>
                          <td className="border border-gray-800 p-3">Vercel</td>
                          <td className="border border-gray-800 p-3">วิเคราะห์การใช้งานเว็บไซต์</td>
                          <td className="border border-gray-800 p-3">2 ปี</td>
                        </tr>
                        <tr className="border border-gray-800 hover:bg-gray-900/50">
                          <td className="border border-gray-800 p-3 font-mono">cookie_consent</td>
                          <td className="border border-gray-800 p-3">จำเป็น</td>
                          <td className="border border-gray-800 p-3">Crystal Lab</td>
                          <td className="border border-gray-800 p-3">เก็บค่าความยินยอมใช้คุกกี้</td>
                          <td className="border border-gray-800 p-3">1 ปี</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">การจัดการคุกกี้</h2>
                <div className="space-y-4 text-gray-400">
                  <p><strong>1. ผ่าน Cookie Banner:</strong> เมื่อคุณเยี่ยมชมเว็บไซต์ครั้งแรก 
                  คุณสามารถเลือกประเภทคุกกี้ที่คุณต้องการอนุญาต</p>
                  
                  <p><strong>2. ผ่านเบราว์เซอร์:</strong> คุณสามารถควบคุมหรือลบคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                  </p>
                  
                  <p><strong>3. การลบคุกกี้:</strong> การลบคุกกี้อาจทำให้การตั้งค่าของคุณถูกรีเซ็ต 
                  และอาจส่งผลต่อประสบการณ์การใช้งานบางส่วน</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">สิทธิ์ของคุณ</h2>
                <p className="text-gray-400">
                  คุณมีสิทธิ์ปฏิเสธการเก็บรวบรวมข้อมูลผ่านคุกกี้ที่ไม่ใช่คุกกี้ที่จำเป็น 
                  โดยสามารถตั้งค่าได้ที่ <Link href="/profile" className="text-cyan-400 hover:underline">การตั้งค่าบัญชี</Link> 
                  หรือผ่าน Cookie Banner
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">การเปลี่ยนแปลงนโยบาย</h2>
                <p className="text-gray-400">
                  เราอาจปรับปรุงนโยบายคุกกี้นี้เป็นครั้งคราว 
                  การเปลี่ยนแปลงจะมีผลทันทีเมื่อประกาศบนหน้านี้
                </p>
              </section>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
                <h3 className="font-semibold mb-3 text-white">ติดต่อเรา</h3>
                <p className="text-gray-400 mb-3">
                  หากคุณมีคำถามเกี่ยวกับนโยบายคุกกี้ กรุณาติดต่อ:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-300"><strong>อีเมล:</strong> privacy@crystallab.com</p>
                  <p className="text-gray-300"><strong>โทรศัพท์:</strong> +66 (0) 2 123 4567</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
                <p><strong>ปรับปรุงล่าสุด:</strong> 15 กันยายน 2569</p>
              </div>
            </>
          ) : (
            // English version
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Cookie Notice</h2>
                <p className="text-gray-300 mb-4">
                  Crystal Lab website uses cookies and similar technologies to enhance your user experience. 
                  Cookies help us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Remember your preferences</li>
                  <li>Improve website security</li>
                  <li>Analyze usage to enhance services</li>
                  <li>Show content relevant to your interests</li>
                </ul>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">What Are Cookies?</h2>
                <p className="text-gray-400">
                  Cookies are small text files stored on your device when you visit our website. 
                  They help the website remember information about your visit, such as language 
                  preference, settings, login status, and other data that improves your browsing experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">1. Strictly Necessary Cookies</h3>
                    <p className="text-gray-400">
                      Essential for basic website functionality, such as login, security, 
                      and preventing fraudulent use.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>Examples:</strong> Session cookies, Authentication cookies</p>
                      <p><strong>Duration:</strong> Session or 24 hours</p>
                      <p><strong>Can be disabled:</strong> No (website won't function properly)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">2. Performance Cookies</h3>
                    <p className="text-gray-400">
                      Help us understand how users interact with our website, such as frequently visited pages, 
                      errors encountered, so we can improve website performance.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>Examples:</strong> Analytics cookies (Vercel Analytics)</p>
                      <p><strong>Duration:</strong> 1-2 years</p>
                      <p><strong>Can be disabled:</strong> Yes (via Cookie Banner)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">3. Functional Cookies</h3>
                    <p className="text-gray-400">
                      Remember your choices like language, currency, region so you don't have 
                      to set them again on each visit.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>Examples:</strong> Language preference, Currency preference</p>
                      <p><strong>Duration:</strong> 1 year</p>
                      <p><strong>Can be disabled:</strong> Yes (may affect user experience)</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">4. Targeting/Advertising Cookies</h3>
                    <p className="text-gray-400">
                      Track browsing behavior to show advertisements or content relevant to your interests.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>Examples:</strong> Facebook Pixel, Google Analytics for ads</p>
                      <p><strong>Duration:</strong> 90 days - 1 year</p>
                      <p><strong>Can be disabled:</strong> Yes (via Cookie Banner)</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Managing Cookies</h2>
                <div className="space-y-4 text-gray-400">
                  <p><strong>1. Via Cookie Banner:</strong> On your first visit, you can select which types of cookies to allow.</p>
                  
                  <p><strong>2. Via Browser Settings:</strong> You can control or delete cookies through browser settings:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                  </p>
                  
                  <p><strong>3. Deleting Cookies:</strong> Deleting cookies may reset your preferences and affect some website features.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Your Rights</h2>
                <p className="text-gray-400">
                  You have the right to refuse non-essential cookies through 
                  <Link href="/profile" className="text-cyan-400 hover:underline mx-1">account settings</Link> 
                  or the Cookie Banner.
                </p>
              </section>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8">
                <h3 className="font-semibold mb-3 text-white">Contact Us</h3>
                <p className="text-gray-400 mb-3">
                  If you have questions about our Cookie Notice, please contact:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-300"><strong>Email:</strong> privacy@crystallab.com</p>
                  <p className="text-gray-300"><strong>Phone:</strong> +66 (0) 2 123 4567</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm mt-8 pt-6 border-t border-gray-800">
                <p><strong>Last Updated:</strong> September 15, 2026</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}