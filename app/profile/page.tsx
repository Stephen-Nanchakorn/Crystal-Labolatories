import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ✅ ดึงข้อมูลปลั๊กอินที่ผู้ใช้ซื้อไปแล้ว (ถ้ามีระบบ orders)
  const { data: purchasedPlugins } = await supabase
    .from("orders")
    .select("plugin_id, plugin_name, purchased_at")
    .eq("user_id", user.id);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
          <SignOutButton />
        </div>

        {/* Tabs (คงไว้เผื่อมีสมาชิกหลายแบบในอนาคต) */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
            สมาชิกทั่วไป
          </span>
          <a href="/plugins" className="text-cyan-400 hover:text-cyan-300 text-sm">
            ← กลับไปร้านค้า
          </a>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* ✅ ฟอร์มแก้ไขโปรไฟล์ (แทนที่ "ข้อมูลบัญชี" เดิม) */}
          <ProfileForm
            userId={user.id}
            currentEmail={user.email || ""}
            currentName={user.user_metadata?.full_name || ""}
          />

          {/* ✅ ปลั๊กอินของฉัน */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h2 className="text-xl font-bold mb-4">ปลั๊กอินของฉัน</h2>
            {purchasedPlugins && purchasedPlugins.length > 0 ? (
              <ul className="space-y-3">
                {purchasedPlugins.map((item: any) => (
                  <li
                    key={item.plugin_id}
                    className="flex justify-between items-center bg-gray-800 rounded-lg p-4"
                  >
                    <span>{item.plugin_name}</span>
                    <span className="text-sm text-gray-400">
                      ซื้อเมื่อ{" "}
                      {new Date(item.purchased_at).toLocaleDateString("th-TH")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">ไม่พบ</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}