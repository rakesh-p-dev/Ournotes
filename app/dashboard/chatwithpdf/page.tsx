"use client";

import AI_Input_Search from "@/components/Chatinput";
import { FileUpload } from "@/components/file-upload";
import React, { useEffect, useRef, useState } from "react";
type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatWithPdfPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: data.reply };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      setMessages((m) => [...m, { id: `a-err-${Date.now()}`, role: "assistant", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      {!uploadedFiles || uploadedFiles.length === 0 ? (
        <div className="relative z-30 max-w-3xl w-full mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Upload PDF to start chatting</h1>
          <p className="mb-4 text-neutral-600">Please upload your PDF (text only). Once uploaded, the chat interface will appear.</p>
          <div className="w-full rounded-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden p-6 bg-white dark:bg-zinc-900">
            <FileUpload
              onUploadStart={(file) => {
                setProcessing(true);
                setProgressMessage("Uploading & extracting document...");
              }}
              onExtract={async (docId, docs, file, summary) => {
                try {
                  console.log("Parsed docs after embedding:", docs);
                  setUploadedFiles([file]);
                  setMessages([
                    {
                      id: "m-1",
                      role: "assistant",
                      text: `Hi — I've received and ingested your file. Here's a quick summary: ${summary}. Ask questions about it!`,
                    },
                  ]);
                } catch (err) {
                  console.error(err);
                  setMessages((m) => [...m, { id: `a-err-${Date.now()}`, role: "assistant", text: "Sorry, ingestion failed." }]);
                } finally {
                  setProcessing(false);
                  setProgressMessage(null);
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="relative z-30 max-w-5xl w-full mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Chat with PDF</h1>
          <h3 className="text-lg mb-4">Your uploaded file is ready — ask questions about it below.</h3>
          <div className="w-full rounded-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden bg-white dark:bg-zinc-900">
              <div ref={listRef} className="relative z-20 h-96 overflow-y-auto rounded-t-xl bg-black/5 dark:bg-white/5 p-4">
              {messages.map((m) => (
                <div key={m.id} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`${m.role === "user" ? "bg-black text-white" : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"} rounded-lg px-4 py-2 shadow-sm max-w-[80%]`}>{m.text}</div>
                </div>
              ))}
            </div>
            <AI_Input_Search value={input} onChange={(v) => setInput(v)} onSubmit={handleSend} />
          </div>
        </div>
      )}
      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-md shadow-lg">
            <p className="text-lg font-semibold">Processing document</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{progressMessage ?? "Working..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
