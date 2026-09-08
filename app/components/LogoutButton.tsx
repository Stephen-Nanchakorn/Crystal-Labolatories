"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg font-medium transition"
    >
      ออกจากระบบ
    </button>
  );
}