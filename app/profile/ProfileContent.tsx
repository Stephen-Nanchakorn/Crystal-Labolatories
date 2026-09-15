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
      <ProfileForm
        userId={userId}
        currentEmail={currentEmail}
        currentName={currentName}
        currentAvatar={currentAvatar}
      />
    </div>
  );
}