"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileForm({
  userId,
  currentEmail,
  currentName,
}: {
  userId: string;
  currentEmail: string;
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });

    setLoading(false);

    if (error) {
      setMessage("เกิดข้อผิดพลาด: " + error.message);
    } else {
      setMessage("บันทึกสำเร็จ!");
      setIsEditing(false);
      router.refresh();
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">ข้อมูลบัญชี</h2>

      <div className="space-y-4">
        {/* ชื่อ (แก้ไขได้) */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">ชื่อที่แสดง</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="ใส่ชื่อของคุณ"
              />
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-4 py-2 rounded-lg"
              >
                {loading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(currentName);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg">{currentName || "ยังไม่ได้ตั้งชื่อ"}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                ✏️ แก้ไข
              </button>
            </div>
          )}
        </div>

        {/* อีเมล (แก้ไม่ได้) */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">อีเมล</label>
          <p className="text-lg">{currentEmail}</p>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.includes("สำเร็จ") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}