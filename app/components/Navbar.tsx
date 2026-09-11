import { createClient } from "@/lib/supabase/server";
import UserMenu from "./usermenu";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = 
    user?.user_metadata?.full_name?.split(" ")[0] || 
    user?.email?.split("@")[0] || 
    "User";

  return (
    <header className="bg-black border-b border-gray-800 px-8 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-white">
          CRYSTAL
        </a>

        <div className="flex items-center gap-8">
          <a href="/" className="text-white hover:text-cyan-400 transition-colors">
            หน้าแรก
          </a>
          <a href="/plugins" className="text-white hover:text-cyan-400 transition-colors">
            ปลั๊กอิน
          </a>

          {user ? (
            // ✅ Login แล้ว → แสดง Hello, ชื่อ + Dropdown
            <UserMenu displayName={displayName} />
          ) : (
            // ❌ ยังไม่ Login → แสดงปุ่มเดิม
            <div className="flex items-center gap-4">
              <a href="/login" className="text-white hover:text-cyan-400 transition-colors">
                เข้าสู่ระบบ
              </a>
              <a
                href="/signup"
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-2 rounded-full transition-colors"
              >
                สมัครสมาชิก
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}