"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import OAuthButtons from "../components/OAuthButtons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">เข้าสู่ระบบ</h1>

        {/* ปุ่ม Google Login */}
        <OAuthButtons />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          ยังไม่มีบัญชี?{" "}
          <a href="/signup" className="text-cyan-400 hover:underline">
            สมัครสมาชิก
          </a>
        </p>
      </form>
    </div>
  );
}