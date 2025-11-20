"use client"
import { Session } from 'next-auth';
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import NotesCard from '@/components/ui/Notescard';
import Notesloader from '@/components/Notesloader';
type Props = {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Allsubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
    
      
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('callbackUrl')) {
        toast.success('Logged in successfully');
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    getSession();
  }, []);

  const getallsubjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subject/getallsubjects", { method: "GET" });
      const data = await response.json();
      setSubjects(data.subject);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setIsLoading(false);
    }
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

        {isLoading ? (
         <Notesloader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects && subjects.map(subject => (
              <NotesCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
        

      </div>
    </div>
  )
}


