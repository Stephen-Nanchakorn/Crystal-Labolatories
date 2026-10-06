"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TrialButtonProps {
  pluginId: string;
  pluginName: string;
}

export default function TrialButton({ pluginId, pluginName }: TrialButtonProps) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert("กรุณาเข้าสู่ระบบก่อนเริ่มทดลองใช้งาน");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/v1/licenses/trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plugin_id: pluginId,
          plugin_name: pluginName,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.error || "Failed to start trial");
      }

      setClaimed(true);
      alert("เปิดสิทธิ์ทดลองใช้งาน 14 วันสำเร็จแล้ว! คุณสามารถดู License Key ได้ในหน้า Profile");
      router.push("/profile");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStartTrial}
      disabled={loading || claimed}
      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-400 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <span>⚡ {loading ? "กำลังเปิดสิทธิ์..." : claimed ? "เริ่มทดลองแล้ว" : "Start 14-Day Free Trial"}</span>
    </button>
  );
}