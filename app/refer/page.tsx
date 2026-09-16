"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { generateReferralLink, getReferralStats } from "@/app/actions/referral";

interface ReferralStats {
  referralLink?: {
    code: string;
    clicks: number;
    conversions: number;
    total_earned: number;
    created_at: string;
  };
  conversions: Array<{
    referred_user_id: string;
    purchase_amount: number;
    commission_earned: number;
    status: string;
    created_at: string;
  }>;
  stats: {
    totalEarned: number;
    totalClicks: number;
    totalConversions: number;
    availableCredits: number;
    conversionRate: string;
  };
}

export default function ReferPage() {
  const { language } = useApp();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // เช็คสถานะล็อกอิน
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        loadStats();
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [supabase.auth]);

  async function loadStats() {
    setLoading(true);
    const result = await getReferralStats();
    if (result.success && result.data) {
      setStats(result.data);
      if (result.data.referralLink) {
        const link = `${window.location.origin}/?ref=${result.data.referralLink.code}`;
        setReferralLink(link);
        setReferralCode(result.data.referralLink.code);
      }
    }
    setLoading(false);
  }

  async function handleGenerateLink() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setGenerating(true);
    const result = await generateReferralLink();
    
    if (result.success && result.data) {
      setReferralLink(result.data.link);
      setReferralCode(result.data.code);
      loadStats(); // โหลดข้อมูลใหม่
    }
    
    setGenerating(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  function shareOnSocial(platform: string) {
    const text = language === "th" 
      ? `ร่วมเป็นส่วนหนึ่งของ Crystal Lab! ใช้ลิงก์นี้เพื่อรับส่วนลด 10%: ${referralLink}`
      : `Join Crystal Lab! Use this link to get 10% off: ${referralLink}`;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(referralLink)}`,
    };
    
    window.open(urls[platform], "_blank", "width=600,height=400");
  }

  // ถ้ายังไม่ล็อกอิน
  if (!isLoggedIn && !loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            {language === "th" ? "ชวนเพื่อน รับเครดิต" : "Refer Friends, Earn Credits"}
          </h1>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <div className="text-6xl mb-6">🔗</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "เข้าสู่ระบบเพื่อเริ่มชวนเพื่อน" : "Sign in to start referring friends"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "สร้างลิงก์พิเศษของคุณและรับเครดิต 10% เมื่อเพื่อนซื้อสินค้า"
                : "Create your special link and earn 10% credit when friends make purchases"}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
            </button>
            <p className="text-gray-500 mt-4 text-sm">
              {language === "th" 
                ? "ยังไม่มีบัญชี? " 
                : "Don't have an account? "}
              <button
                onClick={() => router.push("/signup")}
                className="text-cyan-400 hover:underline"
              >
                {language === "th" ? "สมัครสมาชิกฟรี" : "Sign up free"}
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "th" ? "ชวนเพื่อน รับเครดิต" : "Refer Friends, Earn Credits"}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === "th"
              ? "แบ่งปันลิงก์พิเศษของคุณ รับ 10% ของยอดซื้อเมื่อเพื่อนทำการซื้อ"
              : "Share your special link, earn 10% credit when friends make purchases"}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Referral Link */}
          <div className="lg:col-span-2 space-y-8">
            {/* Referral Link Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === "th" ? "ลิงก์แนะนำของคุณ" : "Your Referral Link"}
              </h2>
              
              {referralLink ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                      {referralLink}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 rounded-lg font-medium transition-colors ${
                        copySuccess
                          ? "bg-green-500 text-white"
                          : "bg-cyan-400 hover:bg-cyan-500 text-black"
                      }`}
                    >
                      {copySuccess 
                        ? (language === "th" ? "คัดลอกแล้ว!" : "Copied!")
                        : (language === "th" ? "คัดลอก" : "Copy")
                      }
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">
                    {language === "th"
                      ? "แบ่งปันลิงก์นี้กับเพื่อน เมื่อเพื่อนใช้ลิงก์นี้ในการสมัครและซื้อสินค้า คุณจะได้รับเครดิต 10% ของยอดซื้อ"
                      : "Share this link with friends. When they use it to sign up and make a purchase, you earn 10% credit of their purchase amount."}
                  </p>

                  {/* Referral Code */}
                  <div className="mb-6">
                    <p className="text-gray-400 mb-2">
                      {language === "th" ? "รหัสแนะนำของคุณ:" : "Your referral code:"}
                    </p>
                    <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg font-bold text-lg">
                      {referralCode}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-6">
                    {language === "th"
                      ? "คุณยังไม่มีลิงก์แนะนำ สร้างเลยเพื่อเริ่มรับเครดิต"
                      : "You don't have a referral link yet. Create one to start earning credits"}
                  </p>
                  <button
                    onClick={handleGenerateLink}
                    disabled={generating}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {generating
                      ? (language === "th" ? "กำลังสร้าง..." : "Generating...")
                      : (language === "th" ? "สร้างลิงก์แนะนำ" : "Generate Referral Link")
                    }
                  </button>
                </div>
              )}

              {/* Share Buttons */}
              {referralLink && (
                <div>
                  <p className="text-gray-400 mb-3">
                    {language === "th" ? "แชร์ไปยัง:" : "Share to:"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => shareOnSocial("facebook")}
                      className="flex-1 min-w-[120px] bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>👍</span> Facebook
                    </button>
                    <button
                      onClick={() => shareOnSocial("twitter")}
                      className="flex-1 min-w-[120px] bg-[#1DA1F2] hover:bg-[#1A91DA] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🐦</span> Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial("whatsapp")}
                      className="flex-1 min-w-[120px] bg-[#25D366] hover:bg-[#22C35E] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💬</span> WhatsApp
                    </button>
                    <button
                      onClick={() => shareOnSocial("line")}
                      className="flex-1 min-w-[120px] bg-[#06C755] hover:bg-[#05B54A] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💚</span> LINE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                {language === "th" ? "วิธีการทำงาน" : "How It Works"}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">1</div>
                  <h3 className="font-semibold mb-2">
                    {language === "th" ? "สร้างลิงก์" : "Create Link"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === "th"
                      ? "สร้างลิงก์แนะนำพิเศษของคุณ"
                      : "Create your special referral link"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">2</div>
                  <h3 className="font-semibold mb-2">
                    {language === "th" ? "แชร์กับเพื่อน" : "Share with Friends"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === "th"
                      ? "แบ่งปันลิงก์ผ่านโซเชียลมีเดียหรือส่งให้เพื่อนโดยตรง"
                      : "Share link via social media or send directly to friends"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">3</div>
                  <h3 className="font-semibold mb-2">
                    {language === "th" ? "รับเครดิต" : "Earn Credits"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === "th"
                      ? "รับเครดิต 10% เมื่อเพื่อนซื้อสินค้าใน Crystal Lab"
                      : "Earn 10% credit when friends purchase from Crystal Lab"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                {language === "th" ? "สถิติของคุณ" : "Your Stats"}
              </h2>
              
              {stats ? (
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400">
                      {language === "th" ? "฿" : "$"}{stats.stats.availableCredits.toFixed(2)}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {language === "th" ? "เครดิตที่ใช้ได้" : "Available Credits"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xl font-bold">{stats.stats.totalClicks}</div>
                      <p className="text-gray-400 text-sm">
                        {language === "th" ? "คลิกทั้งหมด" : "Total Clicks"}
                      </p>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{stats.stats.totalConversions}</div>
                      <p className="text-gray-400 text-sm">
                        {language === "th" ? "การซื้อ" : "Purchases"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xl font-bold">{stats.stats.conversionRate}%</div>
                    <p className="text-gray-400 text-sm">
                      {language === "th" ? "อัตราการซื้อ" : "Conversion Rate"}
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-xl font-bold">
                      {language === "th" ? "฿" : "$"}{stats.stats.totalEarned.toFixed(2)}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {language === "th" ? "รายได้ทั้งหมด" : "Total Earned"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {language === "th"
                      ? "ยังไม่มีข้อมูลสถิติ"
                      : "No stats data available"}
                  </p>
                </div>
              )}
            </div>

            {/* Credit Usage */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === "th" ? "เครดิตใช้ทำอะไรได้บ้าง" : "What Can Credits Be Used For?"}
              </h2>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{language === "th" ? "ลดราคาการซื้อปลั๊กอิน" : "Discount on plugin purchases"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{language === "th" ? "ชำระค่าสมาชิกรายเดือน/รายปี" : "Pay for monthly/yearly subscriptions"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{language === "th" ? "แลกของรางวัลพิเศษ" : "Redeem for special rewards"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{language === "th" ? "ไม่มีวันหมดอายุ" : "Never expires"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats && stats.conversions.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              {language === "th" ? "กิจกรรมล่าสุด" : "Recent Activity"}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 text-gray-400">
                      {language === "th" ? "วันที่" : "Date"}
                    </th>
                    <th className="text-left py-3 text-gray-400">
                      {language === "th" ? "สถานะ" : "Status"}
                    </th>
                    <th className="text-left py-3 text-gray-400">
                      {language === "th" ? "ยอดซื้อ" : "Purchase Amount"}
                    </th>
                    <th className="text-left py-3 text-gray-400">
                      {language === "th" ? "เครดิตที่ได้รับ" : "Credits Earned"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.conversions.slice(0, 5).map((conv, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50">
                      <td className="py-3">
                        {new Date(conv.created_at).toLocaleDateString(
                          language === "th" ? "th-TH" : "en-US"
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          conv.status === 'approved' 
                            ? 'bg-green-900/30 text-green-400' 
                            : conv.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {language === "th" ? "฿" : "$"}{conv.purchase_amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-cyan-400 font-medium">
                        +{language === "th" ? "฿" : "$"}{conv.commission_earned.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-center mt-6">
              <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                {language === "th" ? "ดูประวัติทั้งหมด →" : "View Full History →"}
              </button>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {language === "th"
              ? "เงื่อนไข: เครดิตจะได้รับหลังจากเพื่อนชำระเงินสำเร็จและผ่านระยะเวลายกเลิก 14 วัน"
              : "Terms: Credits are awarded after friend's payment is successful and passes 14-day cancellation period."}
          </p>
          <p className="mt-1">
            {language === "th"
              ? "ผู้ใช้ 1 คน สามารถใช้รหัสแนะนำได้เพียง 1 ครั้ง"
              : "Each user can only use a referral code once."}
          </p>
        </div>
      </div>
    </main>
  );
}