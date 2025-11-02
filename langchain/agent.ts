import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain";

import { embeddings } from "./ingest"; // your embeddings instance

// Helper function to strip markdown formatting
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
    .replace(/__(.*?)__/g, '$1')     // Remove __underline__
    .replace(/_(.*?)_/g, '$1')       // Remove _italic_
    .replace(/`(.*?)`/g, '$1')       // Remove `code`
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
    .replace(/^\s*[-*+]\s+/gm, '')   // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '')   // Remove numbered list markers
    .replace(/\n\s*\n/g, '\n')       // Remove extra newlines
    .trim();
}

// Pinecone / vector store (same as before)
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });
const pineconeIndex = pinecone.index("ournotes");
const vectorStore = new PineconeStore(embeddings, { pineconeIndex });

// Gemini chat model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

/**
 * Retrieve top-k documents for query (same shape you used earlier).
 * Returns serialized string and raw docs.
 */
export async function retrieve({ query }: { query: string }) {
  const retrievedDocs = await (vectorStore as any).similaritySearch(query, 3); // top-3
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

        console.log("Context for RAG prompt:", contextForPrompt);

    const userPromptText = `Context:\n${contextForPrompt}\n\nUser question:\n${userMessage}\n\nAnswer concisely and cite Source lines where appropriate (e.g., "Source: <docId>").`;

    const userMsg = new HumanMessage(userPromptText);

    const res = await (model as any).invoke([systemPrompt, userMsg]);
    console.log(res);

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


