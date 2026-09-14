import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppProvider } from "@/app/context/AppContext";
import ProfileForm from "@/app/components/ProfileForm";
import SignOutButton from "@/app/components/SignOutButton";

// Client component สำหรับแสดงเนื้อหาภาษา
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppProvider>
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <SignOutButton />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <ProfileContent
              userId={user.id}
              currentEmail={user.email || ""}
              currentName={user.user_metadata?.full_name || ""}
              currentAvatar={user.user_metadata?.avatar_url}
            />

            <div className="mt-8 pt-8 border-t border-gray-800">
              <h2 className="text-xl font-bold mb-4">My Plugins</h2>
              <p className="text-gray-500">None found</p>
            </div>
          </div>
        </div>
      </main>
    </AppProvider>
  );
}