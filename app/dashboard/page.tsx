import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const firstLetter = displayName[0]?.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Banner ด้านบน เหมือนหน้า Home */}
      <div className="border-b border-gray-800 py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-white">MY</span>{" "}
          <span className="text-cyan-400">DASHBOARD</span>
        </h1>
        <p className="text-gray-400">จัดการบัญชีและตั้งค่าของคุณ</p>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cyan-400/20 border border-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-400">
                {firstLetter}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                ยินดีต้อนรับ, {displayName}!
              </h2>
              <p className="text-gray-400 mt-1">
                เข้าสู่ระบบเมื่อ:{" "}
                {new Date(user.created_at).toLocaleDateString("th-TH")}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-cyan-400">
              ข้อมูลบัญชี
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">อีเมล</span>
                <span className="text-white">{user.email}</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">ผู้ให้บริการ</span>
                <span className="text-white capitalize">
                  {user.app_metadata?.provider || "email"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">ยืนยันอีเมลแล้ว</span>
                <span
                  className={
                    user.email_confirmed_at
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {user.email_confirmed_at ? "✅ เรียบร้อย" : "⏳ รอยืนยัน"}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-cyan-400">
              การดำเนินการด่วน
            </h3>
            <div className="space-y-3">
              <a
                href="/profile"
                className="block w-full text-center bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2 px-4 rounded-full transition-colors"
              >
                แก้ไขโปรไฟล์
              </a>
              <a
                href="/plugins"
                className="block w-full text-center border border-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-full transition-colors"
              >
                ไปที่หน้าปลั๊กอิน
              </a>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full text-center text-red-400 border border-red-500/40 hover:bg-red-500/10 py-2 px-4 rounded-full transition-colors"
                >
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-cyan-400">
            สถิติการใช้งาน
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-sm text-gray-400">เซสชันที่ใช้งาน</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Today</div>
              <div className="text-sm text-gray-400">เข้าสู่ระบบล่าสุด</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">การแจ้งเตือน</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}