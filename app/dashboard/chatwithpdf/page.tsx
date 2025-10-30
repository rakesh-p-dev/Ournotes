"use client";

import AI_Input_Search from "@/components/Chatinput";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function ChatWithPdfPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // initial welcome message
    setMessages([
      {
        id: "m-1",
        role: "assistant",
        text: "Hi — upload a PDF and ask questions about it. This is a scaffold; connect to your LLM in /api/chat to get real answers.",
      },
    ]);
  }, []);

  useEffect(() => {
    // scroll to bottom when messages change
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
  {/* Centered chat area — integrated message list + input (no outer box) */}
  <div className="relative z-30 max-w-5xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Chat with PDF </h1>
 <h3 className="text-lg  mb-4">Note: You can pass in any PDF to chat with there is no need of uploading it to the application to access it </h3>
        <div className="w-full rounded-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">
          <div ref={listRef} className="relative z-20 h-96 overflow-y-auto rounded-t-xl bg-black/5 dark:bg-white/5 p-4">
          {messages.map((m) => (
            <div key={m.id} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`${m.role === "user" ? "bg-black text-white" : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"} rounded-lg px-4 py-2 shadow-sm max-w-[80%]`}>{m.text}</div>
            </div>
          ))}
          </div>
          <AI_Input_Search />
        </div>
      </div>
     
    </div>
  );
}
