"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
    >
      ออกจากระบบ
    </button>
  );
}