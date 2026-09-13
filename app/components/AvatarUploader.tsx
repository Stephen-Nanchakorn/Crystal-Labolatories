"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function AvatarUploader({
  currentAvatar,
  onAvatarChange,
}: {
  currentAvatar?: string;
  onAvatarChange: (base64: string) => void;
}) {
  const [preview, setPreview] = useState<string>(currentAvatar || "");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError("");

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

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onAvatarChange(base64);
      };
      reader.readAsDataURL(file);
    },
    [onAvatarChange]
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
        {/* Preview รูปวงกลม */}
        <div className="relative w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-4 border-gray-700 flex-shrink-0">
          {preview ? (
            <Image
              src={preview}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
              👤
            </div>
          )}
        </div>

        {/* พื้นที่ Drag & Drop / คลิกเพื่ออัปโหลด */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-cyan-400 bg-cyan-400/10"
              : "border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm text-gray-300">
            ลากไฟล์รูปมาวาง หรือ <span className="text-cyan-400">คลิกเพื่อเลือกไฟล์</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            รองรับ JPG, PNG (ไม่เกิน 5MB)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}