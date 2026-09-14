"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const { language, setLanguage, currency, setCurrency, t } = useApp();
    const router = useRouter();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserAvatar(user.user_metadata?.avatar_url || "");
                setUserName(user.user_metadata?.full_name || "");
            }
        }
        getUser();
    }, [supabase.auth]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all">
                    {userAvatar ? (
                        <Image
                            src={userAvatar}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            👤
                        </div>
                    )}
                </div>
                {userName && (
                    <span className="hidden md:inline text-sm text-gray-300">
                        {userName}
                    </span>
                )}
                <span className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 py-2">
                    {/* User Info */}
          // ในส่วนของปุ่มเปลี่ยนสกุลเงิน ให้แสดงข้อความตามภาษา
                    <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">{t("profile.currency")}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrency("THB")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "THB"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                disabled={language === "en"}
                            >
                                ฿ {t("common.thb")}
                            </button>
                            <button
                                onClick={() => setCurrency("USD")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "USD"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                disabled={language === "th"}
                            >
                                $ {t("common.usd")}
                            </button>
                        </div>
                        {language === "en" && (
                            <p className="text-xs text-gray-400 mt-2">
                                English language uses USD by default
                            </p>
                        )}
                        {language === "th" && (
                            <p className="text-xs text-gray-400 mt-2">
                                ภาษาไทยใช้สกุลเงินบาทเป็นค่าเริ่มต้น
                            </p>
                        )}
                    </div>

                    {/* Language Selection */}
                    <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">{t("profile.language")}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLanguage("th")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${language === "th"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                🇹🇭 ไทย
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${language === "en"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                🇺🇸 English
                            </button>
                        </div>
                    </div>

                    {/* Currency Selection (ถ้าภาษาไทย → THB, ภาษาอังกฤษ → USD) */}
                    <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">{t("profile.currency")}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrency("THB")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "THB"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                disabled={language === "en"} // ถ้าเป็นภาษาอังกฤษ disable THB
                            >
                                ฿ THB
                            </button>
                            <button
                                onClick={() => setCurrency("USD")}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${currency === "USD"
                                        ? "bg-cyan-400 text-black font-medium"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                disabled={language === "th"} // ถ้าเป็นภาษาไทย disable USD
                            >
                                $ USD
                            </button>
                        </div>
                        {language === "en" && (
                            <p className="text-xs text-gray-400 mt-2">English language uses USD by default</p>
                        )}
                        {language === "th" && (
                            <p className="text-xs text-gray-400 mt-2">ภาษาไทยใช้สกุลเงินบาทเป็นค่าเริ่มต้น</p>
                        )}
                    </div>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span>🚪</span>
                        {t("profile.signout")}
                    </button>
                </div>
            )}
        </div>
    );
}