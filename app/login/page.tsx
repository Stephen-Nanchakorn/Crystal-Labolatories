"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";
import { sendPasswordResetEmail } from "@/app/actions/auth";

export default function LoginPage() {
  const { language } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // ==================== STATES ====================
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Forgot Password States
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    // Check if user is already logged in
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check for redirect parameter
        const redirectTo = searchParams.get('redirect');
        if (redirectTo) {
          router.push(decodeURIComponent(redirectTo));
        } else {
          router.push("/profile");
        }
      }
    }
    
    checkUser();
    
    // Check if reset param is in URL
    if (searchParams.get('reset') === 'true') {
      setForgotPassword(true);
    }
  }, [supabase.auth, router, searchParams]);

  // ==================== FUNCTIONS ====================
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!email || !password) {
      setError(language === "th" 
        ? "กรุณากรอกอีเมลและรหัสผ่าน" 
        : "Please enter email and password");
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError(language === "th" 
        ? "กรุณากรอกอีเมลที่ถูกต้อง" 
        : "Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          setError(language === "th" 
            ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" 
            : "Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          setError(language === "th" 
            ? "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ" 
            : "Please confirm your email before signing in");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(language === "th" 
          ? "เข้าสู่ระบบสำเร็จ!" 
          : "Sign in successful!");
        
        // Redirect after successful login
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect');
          if (redirectTo) {
            router.push(decodeURIComponent(redirectTo));
          } else {
            router.push("/profile");
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(language === "th" 
        ? "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" 
        : "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetMessage({
        type: 'error',
        text: language === "th" 
          ? "กรุณากรอกอีเมลที่ถูกต้อง" 
          : "Please enter a valid email"
      });
      return;
    }

    setResetLoading(true);
    setResetMessage(null);

    const result = await sendPasswordResetEmail(resetEmail);
    
    if (result.success) {
      setResetMessage({
        type: 'success',
        text: result.message || (language === "th"
          ? "ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว"
          : "Reset link sent to your email")
      });
      setResetEmail("");
    } else if (result.error) {
      setResetMessage({
        type: 'error',
        text: result.error
      });
    }

    setResetLoading(false);
  }

  function handleSignInWithGoogle() {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  // ==================== RENDER ====================
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎧</div>
          <h1 className="text-4xl font-bold mb-2">
            {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
          </h1>
          <p className="text-gray-400">
            {language === "th" 
              ? "เข้าสู่ระบบเพื่อเข้าถึงปลั๊กอินและเครดิตของคุณ" 
              : "Sign in to access your plugins and credits"}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
            ✅ {success}
          </div>
        )}

        {/* Forgot Password Form */}
        {forgotPassword ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => {
                  setForgotPassword(false);
                  setResetMessage(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold">
                {language === "th" ? "ลืมรหัสผ่าน" : "Forgot Password"}
              </h2>
            </div>
            
            {resetMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                resetMessage.type === 'success' 
                  ? 'bg-green-900/30 border border-green-700 text-green-400' 
                  : 'bg-red-900/30 border border-red-700 text-red-400'
              }`}>
                {resetMessage.type === 'success' ? '✅' : '❌'} {resetMessage.text}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                {language === "th" ? "อีเมลของคุณ" : "Your Email"}
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg mb-6 disabled:opacity-50"
            >
              {resetLoading
                ? (language === "th" ? "กำลังส่ง..." : "Sending...")
                : (language === "th" ? "ส่งลิงก์รีเซ็ตรหัสผ่าน" : "Send Reset Link")
              }
            </button>
            
            <div className="text-center text-gray-500 text-sm">
              {language === "th" 
                ? "ลิงก์รีเซ็ตรหัสผ่านจะถูกส่งไปที่อีเมลของคุณ"
                : "A password reset link will be sent to your email"}
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            {/* Login with Google */}
            <button
              onClick={handleSignInWithGoogle}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-lg mb-6 transition-colors flex items-center justify-center gap-3"
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              {language === "th" ? "เข้าสู่ระบบด้วย Google" : "Sign in with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-800"></div>
              <div className="px-4 text-gray-500 text-sm">
                {language === "th" ? "หรือ" : "or"}
              </div>
              <div className="flex-1 h-px bg-gray-800"></div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">
                  {language === "th" ? "อีเมล" : "Email"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-400">
                    {language === "th" ? "รหัสผ่าน" : "Password"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {showPassword 
                      ? (language === "th" ? "ซ่อน" : "Hide") 
                      : (language === "th" ? "แสดง" : "Show")}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder={language === "th" ? "รหัสผ่านของคุณ" : "Your password"}
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  {language === "th" 
                    ? "ลืมรหัสผ่าน?" 
                    : "Forgot password?"}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === "th" ? "กำลังเข้าสู่ระบบ..." : "Signing in...")
                  : (language === "th" ? "เข้าสู่ระบบ" : "Sign In")
                }
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-400">
                {language === "th" 
                  ? "ยังไม่มีบัญชี? " 
                  : "Don't have an account? "}
                <Link
                  href="/signup"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  {language === "th" ? "สมัครสมาชิกฟรี" : "Sign up free"}
                </Link>
              </p>
            </div>

            {/* Demo Account Info (Optional) */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400 text-center">
                {language === "th"
                  ? "ต้องการทดลองใช้งาน? สมัครฟรีไม่ต้องใส่บัตรเครดิต"
                  : "Want to try? Sign up free, no credit card required"}
              </p>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2"
          >
            ← {language === "th" ? "กลับไปหน้าแรก" : "Back to home"}
          </Link>
        </div>
      </div>
    </main>
  );
}