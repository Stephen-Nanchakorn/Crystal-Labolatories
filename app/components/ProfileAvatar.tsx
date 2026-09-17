"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onUploadSuccess?: (newUrl: string) => void;
}

export default function ProfileAvatar({
  userId,
  avatarUrl,
  email,
  size = "md",
  editable = false,
  onUploadSuccess
}: ProfileAvatarProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(avatarUrl);

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-16 h-16 text-2xl",
    lg: "w-28 h-28 text-4xl"
  };

  const initial = email?.charAt(0).toUpperCase() || "U";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ รองรับไฟล์รูปทุกนามสกุล
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // อัปเดตในตาราง users
      await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      setCurrentUrl(publicUrl);
      onUploadSuccess?.(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("ไม่สามารถอัปโหลดรูปได้");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-cyan-400 flex items-center justify-center font-bold text-black flex-shrink-0`}
      >
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={email}
            width={112}
            height={112}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {editable && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-gray-900 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-gray-800 transition-colors"
            title="เปลี่ยนรูปโปรไฟล์"
          >
            {uploading ? "⏳" : "📷"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}