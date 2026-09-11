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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            จัดการบัญชีและตั้งค่าของคุณ
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600">
                {user.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                ยินดีต้อนรับ, {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}!
              </h2>
              <p className="text-gray-600 mt-1">
                คุณเข้าสู่ระบบเมื่อ: {new Date(user.created_at).toLocaleDateString("th-TH")}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">ข้อมูลบัญชี</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">อีเมล</span>
                <span className="font-medium">{user.email}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">ผู้ให้บริการ</span>
                <span className="font-medium">
                  {user.app_metadata?.provider || "email"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">ยืนยันอีเมลแล้ว</span>
                <span className={`font-medium ${user.email_confirmed_at ? "text-green-600" : "text-yellow-600"}`}>
                  {user.email_confirmed_at ? "✅ เรียบร้อย" : "⏳ รอยืนยัน"}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">การดำเนินการด่วน</h3>
            <div className="space-y-3">
              <a
                href="/profile"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                แก้ไขโปรไฟล์
              </a>
              <a
                href="/settings"
                className="block w-full text-center border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded transition"
              >
                ตั้งค่า
              </a>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="block w-full text-center text-red-600 border border-red-300 hover:bg-red-50 py-2 px-4 rounded transition"
                >
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">สถิติการใช้งาน</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">1</div>
              <div className="text-sm text-gray-600">เซสชันที่ใช้งาน</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">Today</div>
              <div className="text-sm text-gray-600">เข้าสู่ระบบล่าสุด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">0</div>
              <div className="text-sm text-gray-600">การแจ้งเตือน</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}