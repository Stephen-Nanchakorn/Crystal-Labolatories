"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  target_platform: string;
  target_audience: string;
  action_url: string | null;
  created_at: string;
  expires_at: string | null;
}

export default function AdminNotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("announcement");
  const [targetPlatform, setTargetPlatform] = useState("all");
  const [targetAudience, setTargetAudience] = useState("all");
  const [actionUrl, setActionUrl] = useState("https://crystal-labolatories-zc28.vercel.app/plugins/de-feedback");

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("app_notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setFeedback({ type: "error", text: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "กรุณาระบุหัวข้อและข้อความแจ้งเตือน" });
      return;
    }

    setSending(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase
        .from("app_notifications")
        .insert([
          {
            title: title.trim(),
            message: message.trim(),
            category,
            target_platform: targetPlatform,
            target_audience: targetAudience,
            action_url: actionUrl.trim() || null,
          },
        ])
        .select();

      if (error) throw error;

      setFeedback({ type: "success", text: "ส่งประกาศแจ้งเตือน (Broadcast) ไปยัง Crystal Central เรียบร้อยแล้ว!" });
      setTitle("");
      setMessage("");
      fetchNotifications();
    } catch (err: any) {
      setFeedback({ type: "error", text: "ส่งการแจ้งเตือนไม่สำเร็จ: " + err.message });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm("ต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("app_notifications").delete().eq("id", id);
      if (error) throw error;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setFeedback({ type: "success", text: "ลบการแจ้งเตือนสำเร็จ" });
    } catch (err: any) {
      setFeedback({ type: "error", text: "ลบการแจ้งเตือนไม่สำเร็จ: " + err.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📡</span>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent">
                Admin Notification Center
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              ระบบบรอดคาสต์ข้อความและประกาศอัปเดตไปยังแอป Crystal Central (Desktop) และ Web Portal
            </p>
          </div>
          <Link
            href="/profile"
            className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-all backdrop-blur-md"
          >
            ← กลับหน้า Profile
          </Link>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between transition-all ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
              <span className="text-sm font-medium">{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-white text-xs px-2 py-1">
              ✕
            </button>
          </div>
        )}

        {/* Broadcast Form */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
            <span>📢</span> ส่งประกาศใหม่ (Broadcast to Desktop & Web)
          </h2>

          <form onSubmit={handleCreateNotification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  หัวข้อประกาศ (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Crystal De-Feedback Released"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  หมวดหมู่ (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="announcement">ประกาศทั่วไป (Announcement)</option>
                  <option value="release">เปิดตัวปลั๊กอินใหม่ (New Release)</option>
                  <option value="maintenance">แจ้งซ่อมบำรุง / อัปเดต (Maintenance)</option>
                  <option value="alert">การแจ้งเตือนสำคัญ (Urgent Alert)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                ข้อความประกาศ (Message Body) *
              </label>
              <textarea
                required
                rows={3}
                placeholder="รายละเอียดการแจ้งเตือนที่จะไปแสดงในระฆังแจ้งเตือนของ Crystal Central..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  ระบบเป้าหมาย (Platform)
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="all">ทุกระบบ (All Platforms)</option>
                  <option value="macos">macOS Only</option>
                  <option value="windows">Windows Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  กลุ่มผู้ใช้ (Audience)
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="all">ผู้ใช้ทั้งหมด (All Users)</option>
                  <option value="pro_users">ผู้ใช้ที่มี License ซื้อขาด</option>
                  <option value="free_users">ผู้ใช้ Drop-Tune (Free)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Action Link URL
                </label>
                <input
                  type="url"
                  placeholder="https://crystal-labolatories-zc28.vercel.app/..."
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {sending ? "กำลังส่งประกาศ..." : "🚀 ส่งประกาศแจ้งเตือนทันที"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Notifications Feed */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                <span>📋</span> ประวัติการประกาศในระบบ
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                รายการแจ้งเตือนที่พร้อมส่งไปยังแอปพลิเคชัน Crystal Central ทันทีที่ผู้ใช้ Sync Cloud
              </p>
            </div>
            <button
              onClick={fetchNotifications}
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              🔄 รีเฟรช
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-gray-400">ยังไม่มีการแจ้งเตือนใดๆ ในระบบ Supabase</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {item.category.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {item.target_platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{item.message}</p>
                    <div className="text-[11px] text-gray-500 flex items-center gap-4">
                      <span>สร้างเมื่อ: {new Date(item.created_at).toLocaleString("th-TH")}</span>
                      {item.action_url && (
                        <a
                          href={item.action_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          🔗 {item.action_url}
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDeleteNotification(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40 px-3 py-1.5 rounded-lg transition-colors self-start md:self-center disabled:opacity-50"
                  >
                    {deletingId === item.id ? "กำลังลบ..." : "ลบประกาศ"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
