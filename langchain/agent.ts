import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain";

import { embeddings } from "./ingest"; 

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\*(.*?)\*/g, '$1')    
    .replace(/__(.*?)__/g, '$1')     
    .replace(/_(.*?)_/g, '$1')       
    .replace(/`(.*?)`/g, '$1')       
    .replace(/```[\s\S]*?```/g, '')  
    .replace(/^\s*[-*+]\s+/gm, '')   
    .replace(/^\s*\d+\.\s+/gm, '')   
    .replace(/\n\s*\n/g, '\n')       
    .trim();
}

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });
const pineconeIndex = pinecone.index("ournotes");
const vectorStore = new PineconeStore(embeddings, { pineconeIndex });

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY ?? "",
});


export async function retrieve({ query }: { query: string }) {
  const retrievedDocs = await (vectorStore as any).similaritySearch(query, 3); 
  const serialized = retrievedDocs
    .map(
      (doc: any, i: number) =>
        `--- Result ${i + 1} (Source: ${doc.metadata?.docId ?? "unknown"}) ---\n${doc.pageContent}`
    )
    .join("\n\n");
  return [serialized, retrievedDocs] as const;
}

export async function runAgent(userMessage: string) {
  try {
    const [contextSerialized] = await retrieve({ query: userMessage });

   const systemPrompt = new SystemMessage(
  "You are a helpful assistant that answers questions based only on the provided document context. " +
  "If the answer cannot be found in the context, respond that it is not available. " +
  "Do not hallucinate or make assumptions outside the document. " +
  "If the user's question is too general (e.g., 'What is in the document?' or 'Summarize the whole file'), " +
  "politely ask them to be more specific about which topic, section, or information in the PDF they want to know about. " +
  "Encourage the user to refer to particular details or keywords mentioned in the document."
);

    const MAX_CONTEXT_CHARS = 12_000;
    const contextForPrompt =
      contextSerialized.length > MAX_CONTEXT_CHARS
        ? contextSerialized.slice(0, MAX_CONTEXT_CHARS) + "\n\n[TRUNCATED]"
        : contextSerialized;


    const userPromptText = `Context:\n${contextForPrompt}\n\nUser question:\n${userMessage}\n\nAnswer concisely and cite Source lines where appropriate (e.g., "Source: <docId>").`;

    const userMsg = new HumanMessage(userPromptText);

    const res = await (model as any).invoke([systemPrompt, userMsg]);

    const reply = res?.content ?? (res as any)?.text ?? JSON.stringify(res);
    return stripMarkdown(reply);
  } catch (err: any) {
    console.error("RAG chat error:", err?.response?.status, err?.response?.data ?? err?.message);
    throw err;
  }
}

export async function summarizeChunks(chunks: string[]): Promise<string> {
  const context = chunks.slice(0, 3).join("\n\n").slice(0, 2000); // First 3 chunks, limit to 2000 chars
  const prompt = `Summarize what is present in this PDF based on the following excerpts:\n\n${context}\n\nProvide a brief overview of the main topics and content.`;

  const res = await (model as any).invoke([new SystemMessage("You are a helpful assistant."), new HumanMessage(prompt)]);
  const summary = res?.content ?? "Summary not available.";
  return stripMarkdown(summary);
}


