"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
export default function LogOutButton() {
  const handleSignOut = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
      await signOut();
    redirect("/")
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
