"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/context/AppContext";

export default function ProfileMenu() {
  const { language } = useApp();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ระบบ Theme: ค่าเริ่มต้นเป็น "dark" เสมอ
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // โหลด theme จาก localStorage (ถ้าไม่มี ให้ default เป็น dark)
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        const googleAvatar =
          user.user_metadata?.avatar_url || user.user_metadata?.picture;

        const { data: userData } = await supabase
          .from("users")
          .select("balance, avatar_url, preferred_language, preferred_currency")
          .eq("id", user.id)
          .single();

        let finalAvatarUrl = null;
        if (userData?.avatar_url) {
          finalAvatarUrl = userData.avatar_url;
        } else if (googleAvatar) {
          finalAvatarUrl = googleAvatar;
        }

        setAvatarUrl(finalAvatarUrl);
        setBalance(userData?.balance || 0);

        if (!userData) {
          await supabase.from("users").upsert({
            id: user.id,
            email: user.email,
            avatar_url: googleAvatar,
            preferred_language: "en",
            preferred_currency: "USD",
            balance: 0,
            created_at: new Date().toISOString(),
          });
        }
      }

      setIsLoading(false);
    }

    loadUserData();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleAvatarUpload(file: File) {
    if (!user) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("ไม่สามารถอัปโหลดรูปได้");
    }
  }

  async function useGoogleAvatar() {
    if (!user) return;

    const googleAvatar =
      user.user_metadata?.avatar_url || user.user_metadata?.picture;
    if (!googleAvatar) return;

    try {
      await supabase
        .from("users")
        .update({ avatar_url: googleAvatar })
        .eq("id", user.id);

      setAvatarUrl(googleAvatar);
    } catch (error) {
      console.error("Error setting Google avatar:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
      </Link>
    );
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";
  const isGoogleUser =
    user.user_metadata?.provider === "google" ||
    user.user_metadata?.avatar_url?.includes("googleusercontent") ||
    user.user_metadata?.picture?.includes("googleusercontent");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
      >
        {/* Avatar Display */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-cyan-400 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.email || "User"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-black font-bold">{userInitial}</span>
          )}
        </div>

        <span className="hidden md:inline">{user.email?.split("@")[0]}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-cyan-400 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.email || "User"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-black font-bold text-xl">
                      {userInitial}
                    </span>
                  )}
                </div>

                {/* Edit Button */}
                <label className="absolute bottom-0 right-0 bg-gray-800 border border-gray-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  <span className="text-xs">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                </label>

                {/* Google Avatar Button */}
                {isGoogleUser && !avatarUrl && (
                  <button
                    onClick={useGoogleAvatar}
                    className="absolute -bottom-1 -left-1 bg-blue-500 border border-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-600 transition-colors"
                    title="Use Google profile picture"
                  >
                    G
                  </button>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {user.email}
                </div>
                <div className="text-sm text-gray-400">
                  {language === "th"
                    ? "สมาชิก Crystal Lab"
                    : "Crystal Lab Member"}
                </div>
                {isGoogleUser && (
                  <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                    <span className="text-blue-400">G</span>
                    Google Account
                  </div>
                )}
              </div>
            </div>

            {/* Balance Display */}
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {language === "th" ? "เครดิต" : "Credits"}
                </span>
                <span className="text-cyan-400 font-bold">
                  {language === "th" ? "฿" : "$"}
                  {balance.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === "th"
                  ? "ใช้ลดราคาได้ทันที"
                  : "Use for instant discounts"}
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="p-2">
            <Link
              href="/profile"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>👤</span>
              <span>
                {language === "th" ? "โปรไฟล์ของฉัน" : "My Profile"}
              </span>
            </Link>

            <Link
              href="/profile/balance"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>💰</span>
              <span>
                {language === "th" ? "เครดิตของฉัน" : "My Credits"}
              </span>
            </Link>

            <Link
              href="/profile/wishlist"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>❤</span>
              <span>{language === "th" ? "รายการโปรด" : "Wishlist"}</span>
            </Link>

            <Link
              href="/profile/invoices"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>🧾</span>
              <span>
                {language === "th" ? "ใบเสร็จของฉัน" : "My Invoices"}
              </span>
            </Link>

            <Link
              href="/refer"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>👥</span>
              <span>
                {language === "th" ? "ชวนเพื่อนรับเครดิต" : "Refer & Earn"}
              </span>
            </Link>

            <Link
              href="/support"
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>🛟</span>
              <span>
                {language === "th" ? "ขอความช่วยเหลือ" : "Support"}
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800"></div>

          {/* Theme Toggle & Logout */}
          <div className="p-2">
            {/* สลับ Dark Mode / Light Mode แทนปุ่มตั้งค่าเดิม */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
            >
              <div className="flex items-center gap-3">
                <span>{theme === "dark" ? "🌙" : "☀️"}</span>
                <span>
                  {language === "th"
                    ? theme === "dark"
                      ? "โหมดมืด (Dark)"
                      : "โหมดสว่าง (Light)"
                    : theme === "dark"
                    ? "Dark Mode"
                    : "Light Mode"}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-cyan-400 font-mono">
                {theme.toUpperCase()}
              </span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
            >
              <span>🚪</span>
              <span>{language === "th" ? "ออกจากระบบ" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}