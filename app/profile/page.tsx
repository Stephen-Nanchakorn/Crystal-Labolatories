"use client";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* หัวข้อหน้า */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <Link
            href="/"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {/* ข้อมูลบัญชี (User Account Info) */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-200">ข้อมูลบัญชี</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-cyan-400 flex items-center justify-center text-black font-bold text-2xl">
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
              <div className="text-lg font-semibold text-white">
                {user?.user_metadata?.full_name ||
                  user?.email?.split("@")[0] ||
                  "User"}
              </div>
              <div className="text-sm text-gray-400">{user?.email}</div>
              <div className="text-xs text-cyan-400 mt-1">
                สมาชิก Crystal Lab
              </div>
            </div>
          </div>
        </div>

        {/* รายการปลั๊กอินและสิทธิ์การใช้งาน (My Plugins & License Seats) */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-200">
                My Plugins & Licenses
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                จัดการสิทธิ์การใช้งานและเครื่องคอมพิวเตอร์ที่ผูกไว้
              </p>
            </div>
            <span className="text-sm bg-gray-800 text-cyan-400 px-3 py-1 rounded-full font-mono">
              {licenses.length} ปลั๊กอิน
            </span>
          </div>

          {licenses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
              <span className="text-4xl mb-3 block">🎛️</span>
              <p className="text-gray-400 mb-4">ยังไม่พบปลั๊กอินในบัญชีของคุณ</p>
              <Link
                href="/plugins"
                className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
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
                    className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
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
                      <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-gray-400 font-medium">Key:</span>
                        <code className="text-sm font-mono text-cyan-400">
                          {lic.license_key}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(lic.license_key)}
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition-colors"
                        >
                          {copiedKey === lic.license_key ? "คัดลอกแล้ว!" : "Copy"}
                        </button>
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

                      {lic.license_activations && lic.license_activations.length > 0 ? (
                        <div className="space-y-2">
                          {lic.license_activations.map((act) => (
                            <div
                              key={act.id}
                              className="flex items-center justify-between bg-gray-900/60 border border-gray-800/80 px-3 py-2 rounded-lg text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span>{act.os === "Windows" ? "🪟" : "🍎"}</span>
                                <div>
                                  <div className="text-gray-200 text-xs font-semibold">
                                    {act.machine_name || "คอมพิวเตอร์ที่เปิดใช้งาน"}
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
                                {deactivatingId === act.id ? "กำลังปลดล็อก..." : "ปลดล็อกเครื่อง"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic bg-gray-900/40 p-3 rounded-lg border border-gray-800/40">
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