"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./drop-downmenu";

import { Link } from "next-view-transitions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "./theme-toogle";
import LogOutButton from "./Logoutbutton";
import { UserIcon } from "./icons/UserIcon";
import { NotesbookIcon } from "./icons/NotebookIcon";
import { SignOutIcon } from "./icons/SignOutIcon";
import QuestionMarkIcon from "./icons/QuestionMarkIcon";
import AiIcon from "./icons/AiIcon";

export default function Profile() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const isOnOnboardingPage = pathname === "/onboarding";

  if (!session) {
    return (
      <div className="ml-4 flex items-center justify-center gap-2 md:ml-0 md:gap-4">
        <ThemeToggle />
     </div>
    );
  }

  const userFirstName = session?.user?.name?.split(" ")[0];
  const shouldShowOnboardingEffects = !isOnboarded && !isOnOnboardingPage;

  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button 
      className="rounded-full cursor-pointer"
      onClick={() => console.log("DropdownMenuTrigger clicked!")}
    >
      <Avatar
        className={`transition-all duration-200 ${
          shouldShowOnboardingEffects
            ? "relative before:absolute before:-inset-1 before:animate-ping before:rounded-full before:bg-red-500/60 before:duration-[2s] after:absolute after:-inset-2 after:animate-ping after:rounded-full after:bg-red-500/30 after:delay-500 after:duration-[2s]"
            : ""
        }`}>
        <AvatarImage 
          src={session?.user?.image || ""} 
          alt="user" 
        />
        <AvatarFallback>
          {session?.user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
    </button>
  </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4 mr-4 w-44 md:mr-10">
        <DropdownMenuLabel>
          <p className="font-excon text-sm">Hi, {userFirstName}!</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <Link href="/dashboard/profile">
            <DropdownMenuItem
              data-umami-event="profile-dropdown-profile-click"
              className="hover:cursor-pointer"
            >
              <UserIcon />
              Profile
            </DropdownMenuItem>
          </Link>
        <Link href="/dashboard/explore">
          <DropdownMenuItem
            data-umami-event="profile-dropdown-notes-click"
            className="hover:cursor-pointer"
          >
            <NotesbookIcon />
            All Notes
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/createsubject">
          <DropdownMenuItem
            data-umami-event="profile-dropdown-quiz-click"
            className="hover:cursor-pointer"
          >
            <QuestionMarkIcon className="size-4" />
            Create Subject
          </DropdownMenuItem>
        </Link>
        
        <Link href="/dashboard/chatwithpdf">
          <DropdownMenuItem
            data-umami-event="profile-dropdown-ai-assistant-click"
            className="hover:cursor-pointer"
          >
            <AiIcon className="size-4" />
            AI Assistant
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-center">
          <div data-umami-event="profile-dropdown-theme-toggle-click">
            <ThemeToggle />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div data-umami-event="profile-dropdown-report-click">
           
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutIcon className="text-red-500" />
          <div data-umami-event="profile-dropdown-logout-click">
            <LogOutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
