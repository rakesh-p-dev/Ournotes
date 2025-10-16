"use client"
import { Session } from 'next-auth';
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import NotesCard from '@/components/ui/Notescard';

type Props = {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Allsubjects({ params, searchParams }: Props) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get session data
    const getSession = async () => {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSession(data);
      if (data) {
        toast.success('Logged in successfully');
      }
    };
    getSession();
  }, []);

  const getallsubjects = async () => {
    const response = await fetch("/api/subject/getallsubjects", { method: "GET" });
    const data = await response.json();
    setSubjects(data.subject);
  }

  useEffect(() => {
    getallsubjects();
  }, []);

  return (
    <div className='w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
      <div className="container mx-auto px-6 py-8">
        <div className="text-2xl font-bold mb-8">
          ALL SUBJECTS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects && subjects.map(subject => (
            <NotesCard key={subject.id} subject={subject} />
          ))}
        </div>
        

      </div>
    </div>
  )
}


