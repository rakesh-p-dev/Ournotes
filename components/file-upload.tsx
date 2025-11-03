import { cn } from '@/utils/cn';
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from 'react-dropzone'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const PDF_MIME_TYPE = "application/pdf";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  onExtract,
  onUploadStart,
  onUpsertStart,
  onUpsertComplete,
  onProgress,
}: {
  onChange?: (files: File[]) => void;
  onExtract?: (docId: string, docs: any[], file: File, summary: string) => void;
  onUploadStart?: (file: File) => void;
  onUpsertStart?: (docId: string) => void;
  onUpsertComplete?: (docId: string, result: any) => void;
  onProgress?: (message: string | null) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetSelection = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateFile = (file: File): string | null => {
    const isPdf = file.type === PDF_MIME_TYPE || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return "Only PDF files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File size must be 5 MB or less.";
    }

    return null;
  };

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setProgressMessage(null);
      resetSelection();
      return;
    }

    setErrorMessage(null);
    setFiles([file]);
    onChange && onChange([file]);
    uploadAndExtract(file);
  };

  async function uploadAndExtract(file: File) {
    setErrorMessage(null);
    onUploadStart && onUploadStart(file);
    setProgressMessage("Parsing & chunking...");
    onProgress && onProgress("Parsing & chunking...");
    
    try {
     
      const form = new FormData();
      form.append("file", file, file.name);

      const res = await fetch("/api/ingest/parse-embed", {
        method: "POST",
        body: form,
      });
      const response = await res.json();
      if (!response.ok) {
        console.error("parse-embed failed", response);
        setErrorMessage("Failed to process the PDF. Please try again.");
      } else {

        const docId = response.docId ?? `${file.name}-${Date.now()}`;
        const docs = response.docs ?? [];
        const summary = response.summary ?? "Summary not available.";

        onExtract && onExtract(docId, docs, file, summary);

  setProgressMessage("Embedding & uploading...");
  onProgress && onProgress("Embedding & uploading...");
        onUpsertStart && onUpsertStart(docId);

      
        try {
          const upsertRes = await fetch("/api/ingest/upsertchunks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ docId, chunks: docs.map((d: any) => d.pageContent) }),
          });
          
          const upsertJson = await upsertRes.json();
          if (!upsertRes.ok) {
            console.error("upsert-chunks failed", upsertJson);
            setProgressMessage("Upload failed");
            onProgress && onProgress("Upload failed");
            onUpsertComplete && onUpsertComplete(docId, upsertJson);
          } else {
            setProgressMessage("Done");
            onProgress && onProgress("Done");
            onUpsertComplete && onUpsertComplete(docId, upsertJson);
            setTimeout(() => {
              setProgressMessage(null);
              onProgress && onProgress(null);
            }, 1500);
          }
        } catch (upsertErr) {
          console.error("upsert-chunks error", upsertErr);
          setProgressMessage("Upload error");
          onProgress && onProgress("Upload error");
          onUpsertComplete && onUpsertComplete(docId, { error: String(upsertErr) });
        }
      }
    } catch (err) {
      console.error("uploadAndIngest error", err);
      setErrorMessage("Unexpected error during upload. Please try again.");
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    maxSize: MAX_FILE_SIZE_BYTES,
    accept: {
      [PDF_MIME_TYPE]: [".pdf"],
    },
    onDropRejected: (fileRejections) => {
      const firstError = fileRejections?.[0]?.errors?.[0];
      const message = firstError?.message ?? "Only PDF files up to 5 MB are allowed.";
      setErrorMessage(message);
      setProgressMessage(null);
      resetSelection();
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
              {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">{errorMessage}</p>
              )}
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                  {progressMessage && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{progressMessage}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
