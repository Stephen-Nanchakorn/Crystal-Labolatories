"use client";

import { useState, useRef, useEffect } from "react";

interface ABPlayerProps {
  beforeUrl: string; // ลิงก์ไฟล์เสียงก่อนปรับ (Bypass / Dry)
  afterUrl: string;  // ลิงก์ไฟล์เสียงหลังปรับ (Processed / Wet)
  title?: string;
}

export default function ABPlayer({ beforeUrl, afterUrl, title = "A/B Audio Comparison" }: ABPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"before" | "after">("after");
  const [progress, setProgress] = useState(0);

  const beforeRef = useRef<HTMLAudioElement | null>(null);
  const afterRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioBefore = new Audio(beforeUrl);
    const audioAfter = new Audio(afterUrl);

    audioBefore.preload = "auto";
    audioAfter.preload = "auto";

    const onTimeUpdate = () => {
      if (audioAfter.duration) {
        setProgress((audioAfter.currentTime / audioAfter.duration) * 100);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audioAfter.addEventListener("timeupdate", onTimeUpdate);
    audioAfter.addEventListener("ended", onEnded);

    beforeRef.current = audioBefore;
    afterRef.current = audioAfter;

    return () => {
      audioBefore.pause();
      audioAfter.pause();
      audioAfter.removeEventListener("timeupdate", onTimeUpdate);
      audioAfter.removeEventListener("ended", onEnded);
    };
  }, [beforeUrl, afterUrl]);

  const togglePlay = () => {
    if (!beforeRef.current || !afterRef.current) return;

    if (isPlaying) {
      beforeRef.current.pause();
      afterRef.current.pause();
      setIsPlaying(false);
    } else {
      // Sync ไทม์ไลน์เสียงให้ตรงกันระดับมิลลิวินาที
      beforeRef.current.currentTime = afterRef.current.currentTime;
      beforeRef.current.volume = mode === "before" ? 1 : 0;
      afterRef.current.volume = mode === "after" ? 1 : 0;

      beforeRef.current.play();
      afterRef.current.play();
      setIsPlaying(true);
    }
  };

  const switchMode = (newMode: "before" | "after") => {
    setMode(newMode);
    if (!beforeRef.current || !afterRef.current) return;
    if (newMode === "after") {
      afterRef.current.volume = 1;
      beforeRef.current.volume = 0;
    } else {
      afterRef.current.volume = 0;
      beforeRef.current.volume = 1;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!afterRef.current || !beforeRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    const newTime = newProgress * (afterRef.current.duration || 0);

    afterRef.current.currentTime = newTime;
    beforeRef.current.currentTime = newTime;
    setProgress(newProgress * 100);
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-xl mx-auto shadow-2xl">
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Sound Quality Test</span>
          <h4 className="text-base font-bold text-white mt-0.5">{title}</h4>
        </div>

        {/* สวิตช์สลับเสียงแบบไร้รอยต่อ */}
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => switchMode("before")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "before" ? "bg-gray-700 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            ORIGINAL (Dry)
          </button>
          <button
            type="button"
            onClick={() => switchMode("after")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "after" ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20" : "text-gray-400 hover:text-white"
            }`}
          >
            PROCESSED (Wet)
          </button>
        </div>
      </div>

      {/* Progress Seek Bar */}
      <div
        onClick={handleSeek}
        className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden mb-5 cursor-pointer relative border border-gray-800/80"
      >
        <div
          className="bg-cyan-400 h-full rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ปุ่ม Play / Pause */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-full py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
      >
        <span>{isPlaying ? "⏸ พักเสียงชั่วคราว" : "▶ ลองฟังเสียงเปรียบเทียบ"}</span>
      </button>
    </div>
  );
}