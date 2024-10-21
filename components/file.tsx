"use client"
import { useState } from 'react';
import React from 'react'
import Cookie from 'js-cookie';
interface FileProps {
  filename: string;
  filekey: string;
  fileuserid:Number;
  fileid:Number;
  subjectid:Number
}

const File: React.FC<FileProps> = ({ filename, filekey,fileuserid,fileid,subjectid }) => {
  
  const [isDeleting, setIsDeleting] = useState(false);
  
    const userid = Cookie.get('userId');
   
  const handleDownload = async () => {
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
    }
  };
  const handleDelete = async (fileid:Number,) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/file/delete`, { method: 'DELETE',body:JSON.stringify({
          fileKey: filekey,
          fileId:fileid,
          subjectId:subjectid
        })});
       
        if (!response.ok) throw new Error('Network response was not ok');
        const data =await response.json();
        
        const {deleteurl}=data;
       
        await fetch(deleteurl,{method:"DELETE"})
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

  return (
    <div className="bg-background p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <FileIcon className="h-8 w-8 text-primary mr-4" />
        <div>
          <h3 className="text-lg font-medium"> {filename}</h3>
          <p className="text-muted-foreground text-sm">PDF, 5.2 MB</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleDownload} className='sm'>
          Download
        </button>
        {showDeleteButton && (
          <button 
            onClick={()=>handleDelete((Number(fileid)))} 
            className='ml-4 text-red-600 hover:text-red-800'
            disabled={isDeleting}
          >
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
