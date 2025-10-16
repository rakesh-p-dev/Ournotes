"use client"
import { useState } from 'react';
import React from 'react'
import Cookie from 'js-cookie';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ClockIcon, DownloadIcon, TrashIcon } from "@phosphor-icons/react";

interface FileProps {
  filename: string;
  filekey: string;
  fileuserid: Number;
  fileid: Number;
  subjectid: Number;
  uploaderName?: string;
  uploaderImage?: string;
  uploadDate?: string;
  fileSize?: string;
}

const File: React.FC<FileProps> = ({ 
  filename, 
  filekey, 
  fileuserid, 
  fileid, 
  subjectid,
  uploaderName = "Unknown User",
  uploaderImage,
  uploadDate,
  fileSize = "PDF, 5.2 MB"
}) => {
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const userid = Cookie.get('userId');
   
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/file/download/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileurl: filekey }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const { data } = await response.json();
      
      const a = document.createElement('a');
      a.href = data;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (fileid: Number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/file/delete`, { 
          method: 'DELETE',
          body: JSON.stringify({
            fileKey: filekey,
            fileId: fileid,
            subjectId: subjectid
          })
        });
       
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        const { deleteurl } = data;
       
        await fetch(deleteurl, { method: "DELETE" });
        alert('File deleted successfully');
      } catch (error) {
        alert('Failed to delete the file');
      } finally {
        window.location.reload();
        setIsDeleting(false);
      }
    }
  };

  const showDeleteButton = fileuserid === Number(userid);
  const uploaderInitial = uploaderName?.charAt(0) || "U";

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-md border-2 border-black bg-zinc-100 p-6 shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_#757373] dark:hover:shadow-[6px_6px_0px_0px_#757373]">
      
      {/* Header with uploader info */}
     

      {/* File info */}
      <div className="flex items-center gap-4">
        <FileIcon className="h-8 w-8 text-black dark:text-white" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white">
            {filename}
          </h3>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {fileSize}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-zinc-800 dark:text-white dark:shadow-[2px_2px_0px_0px_#757373] dark:hover:shadow-[3px_3px_0px_0px_#757373]"
        >
          <DownloadIcon className="size-4" weight="duotone" />
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
        
        {showDeleteButton && (
          <button 
            onClick={() => handleDelete(Number(fileid))} 
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-md border-2 border-red-500 bg-red-500 px-4 py-2 font-bold text-white shadow-[2px_2px_0px_0px_#dc2626] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#dc2626] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="size-4" weight="duotone" />
            {isDeleting ? 'Deleting...' : 'Delete'} 
          </button>
        )}
      </div>
    </div>
  );
};

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export default File;
