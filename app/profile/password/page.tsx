"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { changePassword } from "@/app/actions/auth";

export default function PasswordPage() {
  const { language } = useApp();
  const router = useRouter();
  const supabase = createClient();
  
  // ==================== STATES ====================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState<{
    current: boolean;
    new: boolean;
    confirm: boolean;
  }>({
    current: false,
    new: false,
    confirm: false
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setLoading(false);
    }
    checkAuth();
  }, [supabase.auth]);

  // ==================== FUNCTIONS ====================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: 'error',
        text: language === "th" 
          ? "กรุณากรอกข้อมูลให้ครบทุกช่อง" 
          : "Please fill in all fields"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: language === "th"
          ? "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
          : "New password must be at least 6 characters"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: language === "th"
          ? "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน"
          : "New password and confirmation do not match"
      });
      return;
    }
    
    if (currentPassword === newPassword) {
      setMessage({
        type: 'error',
        text: language === "th"
          ? "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน"
          : "New password must be different from current password"
      });
      return;
    }
    
    setSubmitting(true);
    
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      setMessage({
        type: 'success',
        text: result.message || (language === "th" 
          ? "เปลี่ยนรหัสผ่านสำเร็จแล้ว" 
          : "Password changed successfully")
      });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 5000);
    } else if (result.error) {
      setMessage({
        type: 'error',
        text: result.error
      });
    }
    
    setSubmitting(false);
  }

  function togglePassword(field: 'current' | 'new' | 'confirm') {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }

  // ==================== RENDER - NOT LOGGED IN ====================
  if (!isLoggedIn && !loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            {language === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}
          </h1>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "th" ? "เข้าสู่ระบบเพื่อเปลี่ยนรหัสผ่าน" : "Sign in to change password"}
            </h2>
            <p className="text-gray-400 mb-8">
              {language === "th"
                ? "คุณต้องเข้าสู่ระบบก่อนที่จะเปลี่ยนรหัสผ่าน"
                : "You need to sign in to change your password"}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg transition-colors w-full"
            >
              {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // ==================== RENDER - MAIN CONTENT ====================
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}
          </h1>
          <p className="text-gray-400">
            {language === "th"
              ? "อัปเดตรหัสผ่านของคุณเพื่อความปลอดภัย"
              : "Update your password for security"}
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-900/30 border border-green-700 text-green-400' 
              : 'bg-red-900/30 border border-red-700 text-red-400'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* FORM */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* CURRENT PASSWORD */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                {language === "th" ? "รหัสผ่านปัจจุบัน" : "Current Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder={language === "th" ? "ป้อนรหัสผ่านปัจจุบัน" : "Enter current password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePassword('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.current ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                {language === "th" ? "รหัสผ่านใหม่" : "New Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder={language === "th" ? "ป้อนรหัสผ่านใหม่" : "Enter new password"}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.new ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {language === "th" 
                  ? "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
                  : "Password must be at least 6 characters"}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-8">
              <label className="block text-gray-400 mb-2">
                {language === "th" ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder={language === "th" ? "ป้อนรหัสผ่านใหม่อีกครั้ง" : "Re-enter new password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePassword('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.confirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? (language === "th" ? "กำลังเปลี่ยนรหัสผ่าน..." : "Changing password...")
                : (language === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password")
              }
            </button>
          </form>

          {/* FORGOT PASSWORD LINK */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={() => router.push("/login?reset=true")}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {language === "th" 
                ? "ลืมรหัสผ่านปัจจุบัน? คลิกที่นี่"
                : "Forgot current password? Click here"}
            </button>
          </div>
        </div>

        {/* SECURITY TIPS */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">
            {language === "th" ? "เคล็ดลับความปลอดภัย" : "Security Tips"}
          </h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                {language === "th"
                  ? "ใช้รหัสผ่านที่ยาวและซับซ้อน"
                  : "Use long and complex passwords"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                {language === "th"
                  ? "อย่าใช้รหัสผ่านเดียวกันสำหรับหลายเว็บไซต์"
                  : "Don't reuse passwords across different sites"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                {language === "th"
                  ? "เปลี่ยนรหัสผ่านทุก 3-6 เดือน"
                  : "Change passwords every 3-6 months"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                {language === "th"
                  ? "เปิดใช้งานการยืนยันสองขั้นตอนหากมี"
                  : "Enable two-factor authentication if available"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}