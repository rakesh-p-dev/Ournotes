"use client"
import Cookie from 'js-cookie';
import { cn } from '@/utils/cn';
import { Label } from '@/components/ui/label';
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Toaster,toast } from 'sonner';
const Fileupload=({params}:{params:{id:string}})=>{
const subjectid=params.id;
const router = useRouter();
const userid = Cookie.get('userId');
const [uploading, setUploading] = useState<boolean>(false);
const [file,setFile]=useState<File | null>(null);
const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files?.length){
setFile(e.target.files[0]);}};
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectid', subjectid);
        formData.append('userid', userid || '');
        const uploadtoast=toast.loading('Uploading the file...')
        try{
            const response =await fetch("/api/file/upload",{method:"POST",body:formData});
            if(!response.ok) throw new Error("Reponse was not ok ");
            const data = await response.json();
            const { uploadUrl, key } = data;
            const File= formData.get("file")
            await fetch(uploadUrl,{method:"PUT",body:File});
            setUploading(false);
            router.push(`/files/${subjectid}`);
            toast.success('File uploaded successfully');
            }catch(error){
            setUploading(false);
            toast.error('Error uploading file');
            }finally{
              toast.dismiss(uploadtoast)
            }
};


return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
       Upload File
      
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        *Note the file should not exceed 4MB you can resize the file here
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="file">Initial File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {uploading ? "Uploading..." : "Upload"}
          &rarr;
          <BottomGradient />
        </button>
      </form>
      <Toaster position="top-center"richColors />
    </div>
)

}
const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };
  
  const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };
  export default Fileupload;