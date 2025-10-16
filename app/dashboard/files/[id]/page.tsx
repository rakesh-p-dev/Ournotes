import { PrismaClient } from "@prisma/client";
import Link from 'next/link';
import File from "@/components/file";
import { cookies } from 'next/headers'
import React from "react";

const prisma = new PrismaClient();

async function getfiles(id: string) {
  const files = await prisma.file.findMany({
    where: {
      subjectId: Number(id),
    },
    include: {
      subject: true,
    },
  });

  return files;
}

export default async function Filepage({ params }: { params: { id: string } }) {
  const files = await getfiles(params.id);
  const cookieStore = cookies();
  const id = params.id;

  const userid = cookieStore.get('userId');
  const fileuserid = files[0]?.userid;

  if (!id) {
    return <div>Loading...</div>;
  }

  const showuploadbutton = Number(fileuserid) === Number(userid?.value);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Subject Files
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {files.length} {files.length === 1 ? 'file' : 'files'} available
          </p>
        </div>

        {/* Files Container */}
        <div className="space-y-4 pb-20">
          {files && files.length > 0 ? (
            files.map(file => (
              <div key={file.id}>
                <File 
                  filename={file.filename} 
                  filekey={file.fileurl} 
                  fileuserid={file.userid} 
                  fileid={file.id} 
                  subjectid={file.subjectId}  
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                No files uploaded yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button - Fixed Position */}
      {showuploadbutton && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href={`/dashboard/files/newfile/${id}`}>
            <button className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-6 py-3 font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[6px_6px_0px_0px_#757373]">
              <UploadIcon className="size-5" />
              Upload File
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Upload Icon Component
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
