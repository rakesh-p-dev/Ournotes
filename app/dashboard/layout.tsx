"use client"
import React from 'react';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/Sibebar';
import { useState } from 'react';
import { IconSearch, IconFile, IconFilePencil, IconArrowLeft, IconFileTextAi, IconUser } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

interface ChildProps {
  session?: Session | null;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const links = [
    {
      label: "Your Subjects",
      href: "/dashboard/yoursubjects",
      icon: (
        <IconFile className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Create Subject",
      href: "/dashboard/createsubject",
      icon: (
        <IconFilePencil className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Explore Subjects",
      href: "/dashboard/explore",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chat with Pdf",
      href: "/dashboard/chatwithpdf",
      icon: (
        <IconFileTextAi className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
    
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<ChildProps>(child)) {
      return React.cloneElement(child, { session });
    }
    return child;
  });

  return (
    <div className={cn(
      "w-full h-screen flex bg-background"
    )}>
      {/* Sidebar overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Sidebar: fixed on desktop, overlay on mobile */}
      <div
        className={cn(
          "z-30 h-full top-0 left-0 transition-transform duration-300",
          "fixed md:relative w-[300px]",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ background: 'inherit' }}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <Link
                href="#"
                className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
              >
                <div className="h-8 w-8 bg-gray-500 text-white flex items-center justify-center rounded-full">
                  <span className="font-bold text-lg">
                    <span className="text-white">O</span>
                    <span className="text-red-300">N</span>
                  </span>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-black dark:text-white whitespace-pre"
                >
                  OurNotes
                </motion.span>
              </Link>
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
              <div className='mt-2'>
                <button onClick={handleSignOut}>
                  <div className='flex items-center justify-start gap-2 group/sidebar py-2'>
                    <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    <div className='text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'>
                      Sign out
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: session?.user?.name ?? "",
                  href: "/dashboard/profile",
                  icon: (
                    <Image
                      src={session?.user?.image ?? ""}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
      {/* Main content: always fills available space and shrinks responsively */}
      <main
        className={cn(
          "flex-1 h-full transition-all duration-300 ml-0 pt-8"
        )}
      >
        {childrenWithProps}
      </main>
    </div>
  );
}



