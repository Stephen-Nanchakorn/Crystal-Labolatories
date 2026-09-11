import { createClient } from "@/lib/supabase/server";
import UserMenu from "./usermenu";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // สร้างชื่อแสดง (จาก full_name หรือ email)
  const displayName = 
    user?.user_metadata?.full_name?.split(" ")[0] || 
    user?.email?.split("@")[0] || 
    "User";

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-gray-800 px-8 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg"></div>
          <span className="text-2xl font-bold tracking-tighter">
            <span className="text-white">CRYSTAL</span>
            <span className="text-cyan-400">LABS</span>
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="/" 
            className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
          >
            หน้าแรก
          </a>
          <a 
            href="/plugins" 
            className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
          >
            ปลั๊กอิน
          </a>
          <a 
            href="/pricing" 
            className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
          >
            ราคา
          </a>
          <a 
            href="/support" 
            className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
          >
            ช่วยเหลือ
          </a>
        </div>

        {/* Login/Signup หรือ User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            // ✅ Login แล้ว → แสดง Hello, ชื่อ + Dropdown
            <UserMenu displayName={displayName} />
          ) : (
            // ❌ ยังไม่ Login → แสดงปุ่มเดิม
            <>
              <a 
                href="/login" 
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
              >
                เข้าสู่ระบบ
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-semibold px-6 py-2 rounded-full transition-all hover:scale-105"
              >
                สมัครสมาชิก
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}