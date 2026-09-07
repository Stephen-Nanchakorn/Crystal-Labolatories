"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">สมัครสมาชิก</h1>

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
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition"
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          มีบัญชีอยู่แล้ว?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </form>
    </div>
  );
}