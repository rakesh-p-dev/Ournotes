"use client"
import { BentoGrid,BentoGridItem } from '@/components/ui/bento-grid';
import { motion } from "framer-motion";
import { cn } from '@/utils/cn';
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineClass } from "react-icons/md";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect,useState } from "react";
import { Toaster,toast } from 'sonner';
export default function Allsubjects(){
  const [subjects,setSubjects]=useState<any[]>([]);
  const { data: session, status } = useSession();
 if(status=="authenticated"){
  toast.success('Logged in successfully');
 }
  const getallsubjects = async () => {
    const response = await fetch("/api/subject/getallsubjects", { method: "GET" });
    const data = await response.json();
    setSubjects(data.subject);
  }
  useEffect(()=>{
    getallsubjects();
  },[]);
 
 
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };


  return (
    <div>
    <div className="text-lg font-bold">
  ALL SUBJECTS
</div>

<div className="w-full max-w-4xl h-[80vh] overflow-auto ">
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {subjects && subjects.map(subject => (
          <div key={subject.id} className="col-span-1 md:col-span-1">
            <Link href={`/dashboard/files/${subject.id}`}>
            <BentoGrid className="max-w-4xl w-full md:auto-rows-[20rem]">
              <BentoGridItem
                title={subject.user.name}
                description={<div className='flex item-center'><MdOutlineClass className="h-4 w-4 text-neutral-500 " />
                <span className="text-sm">{subject.department.name} </span></div>}
                header={<motion.div
                  initial="initial"
                  animate="animate"
                  variants={variants}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
                  style={{
                    background:
                      "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                    backgroundSize: "400% 400%",
                  }}
                >
                  <motion.div className="h-full w-full rounded-lg flex items-center justify-center"><div className=' text-center justify-center font-bold'>{subject.name.toUpperCase()}</div></motion.div>
                </motion.div>}
                className={cn("[&>p:text-lg]", "md:col-span-1")}
                icon={<FaUserAlt className="h-4 w-4 text-neutral-500" />}
              />
            </BentoGrid>
            </Link>
          </div>
        ))}
      </div>
      <Toaster position="bottom-center"richColors />
    </main>
    
    </div>
  </div>
  )

















}


