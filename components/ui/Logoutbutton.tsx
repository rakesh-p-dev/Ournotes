"use client";

import { signOut } from "next-auth/react";

export default function LogOutButton() {
  const handleSignOut = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      data-umami-event="auth-logout-button-click"
      onClick={handleSignOut}
      className="font-excon cursor-pointer text-red-500"
      type="button"
    >
      Log Out
    </button>
  );
}
