"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function AvatarUploader({
  userId,
  currentAvatar,
  onAvatarChange,
}: {
  userId: string;
  currentAvatar?: string;
  onAvatarChange: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string>(currentAvatar || "");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const processFile = useCallback(
    async (file: File) => {
      setError("");

      // ✅ ตรวจสอบว่าผู้ใช้ login แล้ว
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("กรุณาล็อกอินก่อนอัปโหลดรูป");
        return;
      }

      // ✅ ตรวจสอบชนิดไฟล์
      if (!file.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      // ✅ ตรวจสอบขนาดไฟล์ (จำกัด 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
        return;
      }

      // แสดง preview ทันทีระหว่างอัปโหลด
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      setUploading(true);

      try {
        // ✅ ใช้ user.id แทน userId prop (ปลอดภัยกว่า)
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // ✅ ลบไฟล์เก่าถ้ามี (optional)
        if (currentAvatar?.includes(user.id)) {
          const oldFileName = currentAvatar.split("/").pop();
          if (oldFileName) {
            await supabase.storage.from("avatars").remove([oldFileName]);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // ✅ ดึง URL สาธารณะ
        const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

        onAvatarChange(data.publicUrl);
        setPreview(data.publicUrl);
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(`อัปโหลดไม่สำเร็จ: ${err.message}`);
      } finally {
        setUploading(false);
      }
    },
    [supabase, currentAvatar, onAvatarChange]
  );

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-4 border-gray-700 flex-shrink-0">
          {preview ? (
            <Image
              src={preview}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">👤</div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            </div>
          )}
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-cyan-400 bg-cyan-400/10" : "border-gray-700 hover:border-gray-500"
            }`}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm text-gray-300">
            ลากไฟล์รูปมาวาง หรือ <span className="text-cyan-400">คลิกเพื่อเลือกไฟล์</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG (ไม่เกิน 5MB)</p>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}