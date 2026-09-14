"use client";

import { useApp } from "@/app/context/AppContext";
import ProfileForm from "@/app/components/ProfileForm";

export default function ProfileContent({
  userId,
  currentEmail,
  currentName,
  currentAvatar,
}: {
  userId: string;
  currentEmail: string;
  currentName: string;
  currentAvatar?: string;
}) {
  const { t } = useApp();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t("profile.account")}</h2>
      <ProfileForm
        userId={userId}
        currentEmail={currentEmail}
        currentName={currentName}
        currentAvatar={currentAvatar}
      />
    </div>
  );
}