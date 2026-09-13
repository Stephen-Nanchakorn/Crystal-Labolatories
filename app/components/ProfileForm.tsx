"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AvatarUploader from "@/app/components/AvatarUploader";

export default function ProfileForm({
  currentEmail,
  currentName,
  currentAvatar,
}: {
  currentEmail: string;
  currentName: string;
  currentAvatar?: string;
}) {
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: avatar },
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

      {isEditing ? (
        <div className="space-y-4">
          <AvatarUploader currentAvatar={avatar} onAvatarChange={setAvatar} />

          <div>
            <label className="text-sm text-gray-400 block mb-1">
              ชื่อที่แสดง
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              placeholder="ใส่ชื่อของคุณ"
            />
          </div>

          <div className="flex gap-2">
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
                setAvatar(currentAvatar || "");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-lg">{name || "ยังไม่ได้ตั้งชื่อ"}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                ✏️ แก้ไขโปรไฟล์
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">{currentEmail}</p>
          </div>
        </div>
      )}

      {message && (
        <p className={`text-sm mt-3 ${message.includes("สำเร็จ") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}