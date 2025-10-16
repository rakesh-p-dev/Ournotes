"use client"
interface User {
  name: string | number | bigint | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined;
}
interface Department {
  name: string | number | bigint | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined;
}
interface Subject {
  id: React.Key | null | undefined;
  user: User;
  department: Department;
  name: string;
}
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClockIcon, FolderIcon } from "@phosphor-icons/react";

const Profile = () => {
  const { data: session, status } = useSession();
  const [subjects, setSubjects] = useState<any>(null);
  
  const getsubjects = async () => {
    const response = await fetch("/api/subject/getusersubject", { method: "GET" });
    const data = await response.json();
    setSubjects(data.subject);
  };
  
  useEffect(() => {
    getsubjects();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Profile
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Section */}
          <div className="lg:w-1/3">
            <div className="flex flex-col items-center gap-4 p-6 rounded-md border-2 border-black bg-zinc-100 shadow-[4px_4px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_#757373]">
              <Avatar className="size-24 border-2 border-black dark:border-white/20">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-zinc-800 font-bold text-white dark:bg-zinc-200 dark:text-black text-2xl">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  {session?.user?.name}
                </h2>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                Your Subjects
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {subjects?.length || 0} {subjects?.length === 1 ? 'subject' : 'subjects'} available
              </p>
            </div>

            <div className="space-y-4">
              {subjects && subjects.length > 0 ? (
                subjects.map((subject: Subject) => (
                  <Link key={subject.id} href={`/dashboard/files/${subject.id}`}>
                    <SubjectCard 
                      subjectName={subject.name}
                      userName={subject.user.name}
                      departmentName={subject.department.name}
                    />
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
                    No subjects available.
                  </p>
                  <Link href="/dashboard/add-subject">
                    <button className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-6 py-3 font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[6px_6px_0px_0px_#757373]">
                      Add New Subject
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Subject Card Component using File component styling
const SubjectCard: React.FC<{
  subjectName: any;
  userName: any;
  departmentName: any;
}> = ({ subjectName, userName, departmentName }) => {
  return (
    <div className="mb-4 flex flex-col gap-4 rounded-md border-2 border-black bg-zinc-100 p-6 shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[6px_6px_0px_0px_#757373]">
      
      {/* Header with user info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border-2 border-black dark:border-white/20">
            <AvatarFallback className="bg-zinc-800 font-bold text-white dark:bg-zinc-200 dark:text-black">
              {userName?.toString().charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-black dark:text-white">
              {userName}
            </p>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {departmentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <ClockIcon className="size-4" weight="duotone" />
          <span className="text-sm font-bold">Subject</span>
        </div>
      </div>

      {/* Subject info */}
      <div className="flex items-center gap-4">
        <FolderIcon className="h-8 w-8 text-black dark:text-white" weight="duotone" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white">
            {subjectName}
          </h3>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Click to view files
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile