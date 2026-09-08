import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../components/LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ถ้ายังไม่ได้ล็อกอิน ให้ Redirect ไปหน้า Login
  if (!user) {
    redirect("/login");
  }

  // ดึงข้อมูลโปรไฟล์เพิ่มเติมจากตาราง profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_premium")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
          <LogoutButton />
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 space-y-6">
          {/* แสดงสถานะสมาชิก */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className={`px-4 py-2 rounded-full font-bold ${
                profile?.is_premium
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500"
                  : "bg-gray-700"
              }`}
            >
              {profile?.is_premium ? "🌟 สมาชิก Premium" : "สมาชิกทั่วไป"}
            </div>
            <a
              href="/plugins"
              className="text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              ← กลับไปร้านค้า
            </a>
          </div>

          {/* ข้อมูลผู้ใช้ */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">ข้อมูลบัญชี</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">อีเมล</p>
                  <p className="font-mono">{user.email}</p>
                </div>
                {profile?.full_name && (
                  <div>
                    <p className="text-gray-400">ชื่อ-นามสกุล</p>
                    <p>{profile.full_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">รหัสผู้ใช้</p>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>

            {/* ส่วนสถานะการสั่งซื้อ (จะใส่ข้อมูลในภายหลัง) */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">สถานะการใช้งาน</h2>
              <p className="text-gray-400">
                {profile?.is_premium
                  ? "✅ คุณสามารถดาวน์โหลดปลั๊กอินทั้งหมดได้แล้ว"
                  : "🔓 อัปเกรดเป็น Premium เพื่อปลดล็อกการดาวน์โหลด"}
              </p>
              {!profile?.is_premium && (
                <a
                  href="/plugins"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 rounded-lg font-bold transition"
                >
                  ดูปลั๊กอินและอัปเกรด
                </a>
              )}
            </div>
          </div>

          {/* Plugin ที่เคยซื้อ (หลังจากมีระบบ Webhook แล้ว) */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">ปลั๊กอินของฉัน</h2>
            <p className="text-gray-400">
              กำลังโหลดข้อมูล... (ระบบกำลังพัฒนา)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}