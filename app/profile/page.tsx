"use client";

import OneClickInstallButton from "@/app/components/OneClickInstallButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Activation {
  id: string;
  hardware_uuid: string;
  machine_name: string;
  os: string;
  activated_at: string;
}

interface LicenseItem {
  id: string;
  plugin_id: string;
  plugin_name: string;
  license_key: string;
  max_seats: number;
  status: string;
  created_at: string;
  license_activations: Activation[];
}

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  // Form states for profile & security editing
  const [fullName, setFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfileAndLicenses() {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUser(user);
      setFullName(user?.user_metadata?.full_name || "");
      setNewEmail(user?.email || "");

      // ดึงข้อมูล licenses พร้อมเครื่องคอมพิวเตอร์ที่ activate อยู่
      const { data: licenseData, error } = await supabase
        .from("licenses")
        .select(`
          id,
          plugin_id,
          plugin_name,
          license_key,
          max_seats,
          status,
          created_at,
          license_activations (
            id,
            hardware_uuid,
            machine_name,
            os,
            activated_at
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && licenseData) {
        setLicenses(licenseData as unknown as LicenseItem[]);
      }

      setIsLoading(false);
    }

    loadProfileAndLicenses();
  }, [supabase]);

  // ฟังก์ชันคัดลอก License Key
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ฟังก์ชันปลดล็อกเครื่อง (Deactivate)
  const handleDeactivate = async (activationId: string) => {
    if (!confirm("คุณต้องการปลดล็อกสิทธิ์จากคอมพิวเตอร์เครื่องนี้ใช่หรือไม่?")) {
      return;
    }

    setDeactivatingId(activationId);
    try {
      const { error } = await supabase
        .from("license_activations")
        .delete()
        .eq("id", activationId);

      if (error) throw error;

      // อัปเดต State หน้าเว็บทันที
      setLicenses((prev) =>
        prev.map((lic) => ({
          ...lic,
          license_activations: lic.license_activations.filter(
            (act) => act.id !== activationId
          ),
        }))
      );
    } catch (err: any) {
      alert("ไม่สามารถปลดล็อกเครื่องได้: " + err.message);
    } finally {
      setDeactivatingId(null);
    }
  };

  // อัปเดตชื่อผู้ใช้งาน (Display Name)
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsUpdatingName(true);
    setStatusMessage(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        setStatusMessage({
          type: "success",
          text: "อัปเดตชื่อผู้ใช้งานสำเร็จเรียบร้อยแล้ว",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการอัปเดตชื่อ: " + err.message,
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  // อัปเดตอีเมล (Email)
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newEmail.trim() === user?.email) return;

    setIsUpdatingEmail(true);
    setStatusMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      });

      if (error) throw error;
      setStatusMessage({
        type: "success",
        text: `ระบบส่งลิงก์ยืนยันไปยังอีเมลใหม่ (${newEmail}) และอีเมลเดิมแล้ว โปรดคลิกเพื่อยืนยันการเปลี่ยนแปลง`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการเปลี่ยนอีเมล: " + err.message,
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // เปลี่ยนรหัสผ่าน (Password)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatusMessage({
        type: "error",
        text: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน",
      });
      return;
    }

    setIsUpdatingPassword(true);
    setStatusMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      setStatusMessage({
        type: "success",
        text: "เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: " + err.message,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const isGoogleUser = user?.app_metadata?.provider === "google";

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent">
              My Profile & Settings
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              จัดการข้อมูลบัญชี ความปลอดภัย และสิทธิ์ปลั๊กอิน Crystal
            </p>
          </div>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-all backdrop-blur-md"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between transition-all ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Profile Card & Info */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
            <span>👤</span> ข้อมูลบัญชีผู้ใช้
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-bold text-2xl shadow-lg shadow-cyan-500/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  user?.email?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="text-lg font-semibold text-white flex items-center gap-2">
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "User"}
                  {isGoogleUser && (
                    <span className="text-[11px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-full text-gray-300 font-mono">
                      Google OAuth
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400">{user?.email}</div>
                <div className="text-xs text-cyan-400 mt-1 font-medium">
                  สมาชิก Crystal Laboratories
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:max-w-xs">
              <div className="text-gray-300 font-semibold mb-1">User ID:</div>
              <div className="font-mono text-[11px] break-all text-gray-400">
                {user?.id}
              </div>
            </div>
          </div>

          {/* Edit Profile Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Change Display Name */}
            <form onSubmit={handleUpdateName} className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                แก้ไขชื่อผู้ใช้งาน (Display Name)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ชื่อที่ต้องการแสดง"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isUpdatingName}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {isUpdatingName ? "บันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>

            {/* Change Email */}
            <form onSubmit={handleUpdateEmail} className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                เปลี่ยนอีเมล (Email)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="อีเมลใหม่"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isUpdatingEmail || newEmail === user?.email}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {isUpdatingEmail ? "ส่ง..." : "เปลี่ยนอีเมล"}
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                * ระบบจะส่งอีเมลยืนยันเพื่อความปลอดภัย
              </p>
            </form>
          </div>

          {/* Change / Set Password Section */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-2">
              <span>🔐</span> ความปลอดภัย & รหัสผ่าน (Password)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {isGoogleUser
                ? "คุณสามารถตั้งรหัสผ่านสำหรับเข้าสู่ระบบด้วยอีเมลและรหัสผ่านได้เช่นกันนอกเหนือจาก Google Login"
                : "กำหนดหรือเปลี่ยนรหัสผ่านบัญชีของคุณ"}
            </p>

            <form
              onSubmit={handleUpdatePassword}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isUpdatingPassword ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
              </button>
            </form>
          </div>
        </div>

        {/* รายการปลั๊กอินและสิทธิ์การใช้งาน (My Plugins & License Seats) */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                <span>🎛️</span> My Plugins & Licenses
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                จัดการสิทธิ์การใช้งานและเครื่องคอมพิวเตอร์ที่ผูกไว้ (Seats Management)
              </p>
            </div>
            <span className="text-sm bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3.5 py-1 rounded-full font-mono">
              {licenses.length} ปลั๊กอิน
            </span>
          </div>

          {licenses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <span className="text-4xl mb-3 block">🎛️</span>
              <p className="text-gray-400 mb-4">ยังไม่พบปลั๊กอินในบัญชีของคุณ</p>
              <Link
                href="/plugins"
                className="inline-block bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
              >
                เลือกดูปลั๊กอินทั้งหมด
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {licenses.map((lic) => {
                const usedSeats = lic.license_activations?.length || 0;
                return (
                  <div
                    key={lic.id}
                    className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-cyan-500/30 transition-all hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {lic.plugin_name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-mono ${
                              lic.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {lic.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Product ID: {lic.plugin_id}
                        </p>
                      </div>

                      {/* License Key Box */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-gray-400 font-medium">
                          Key:
                        </span>
                        <code className="text-sm font-mono text-cyan-400">
                          {lic.license_key}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(lic.license_key)}
                          className="text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-2.5 py-1 rounded transition-colors"
                        >
                          {copiedKey === lic.license_key ? "คัดลอกแล้ว!" : "Copy"}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                        <OneClickInstallButton
                          pluginSlug={lic.plugin_id}
                          pluginName={lic.plugin_name}
                        />
                      </div>
                    </div>

                    {/* Seat & Activations Manager */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs mb-3">
                        <span className="text-gray-400 font-medium">
                          การเปิดใช้งานบนคอมพิวเตอร์ (Seats)
                        </span>
                        <span className="font-mono text-gray-300">
                          {usedSeats} / {lic.max_seats} เครื่อง
                        </span>
                      </div>

                      {lic.license_activations &&
                      lic.license_activations.length > 0 ? (
                        <div className="space-y-2">
                          {lic.license_activations.map((act) => (
                            <div
                              key={act.id}
                              className="flex items-center justify-between bg-black/40 border border-white/5 px-3 py-2 rounded-lg text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span>{act.os === "Windows" ? "🪟" : "🍎"}</span>
                                <div>
                                  <div className="text-gray-200 text-xs font-semibold">
                                    {act.machine_name ||
                                      "คอมพิวเตอร์ที่เปิดใช้งาน"}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    UUID: {act.hardware_uuid.slice(0, 16)}...
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled={deactivatingId === act.id}
                                onClick={() => handleDeactivate(act.id)}
                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                              >
                                {deactivatingId === act.id
                                  ? "กำลังปลดล็อก..."
                                  : "ปลดล็อกเครื่อง"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic bg-black/20 p-3 rounded-lg border border-white/5">
                          ยังไม่มีคอมพิวเตอร์ที่เปิดใช้งานสิทธิ์คีย์นี้ (พร้อมลงทะเบียนในแอป Central)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
