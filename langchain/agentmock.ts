import { HumanMessage, SystemMessage } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retrieve, stripMarkdown, summarizeChunks } from "./agent";

type Msg = { role: "user" | "assistant"; text: string; ts: number };
type ThreadState = {
  messages: Msg[];
  sawSummary?: boolean;
  docSummary?: string;
};

const THREADS: Record<string, ThreadState> = {};

const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY ?? "",
});
const model = {
  invoke: async (messages: any[]) => {
    if (typeof (chatModel as any).invoke === "function") {
      return await (chatModel as any).invoke(messages);
    }
  },
};

function ensureThread(threadId: string) {
  if (!THREADS[threadId]) THREADS[threadId] = { messages: [] };
}

function addMessage(threadId: string, role: Msg["role"], text: string) {
  ensureThread(threadId);
  THREADS[threadId].messages.push({ role, text, ts: Date.now() });

  const MAX_HISTORY = 12;   
  const KEEP_LAST = 10; 
  const msgs = THREADS[threadId].messages;
  if (msgs.length > MAX_HISTORY) {
    THREADS[threadId].messages = [msgs[0], ...msgs.slice(-KEEP_LAST)];
  }
}


function getTrimmedHistory(threadId: string, maxEntries = 6) {
  ensureThread(threadId);
  const m = THREADS[threadId].messages;

  if (m.length <= maxEntries) return m;

  const summary= m[0];
  const last = m.slice(-(maxEntries - 1));
  return [summary, ...last];
}

async function fetchTopChunksForSummary(k = 12) {
  try {
    const [serialized, retrieved] = await retrieve({ query: "" });
    const chunkTexts = (retrieved ?? []).map((d: any) => d.pageContent ?? d.content ?? "");
    return chunkTexts.filter(Boolean).slice(0, k);
  } catch (e) {
    console.warn("fetchTopChunksForSummary fallback:", e);
    return [];
  }
}

export async function runAgent(userMessage: string, opts?: { threadId?: string }) {
  const threadId = opts?.threadId ?? "default";
  ensureThread(threadId);

  try {
    if (!THREADS[threadId].docSummary) {
      const chunks = await fetchTopChunksForSummary(12);
      if (chunks.length > 0) {
        try {
          const docSummary = await summarizeChunks(chunks);
          THREADS[threadId].docSummary = docSummary;
          THREADS[threadId].sawSummary = false;
        } catch (summErr) {
          console.warn("summarizeChunks error:", summErr);
          THREADS[threadId].docSummary = undefined;
        }
      } else {
        THREADS[threadId].docSummary = undefined;
      }
    }

    if (THREADS[threadId].docSummary && !THREADS[threadId].sawSummary) {
      THREADS[threadId].sawSummary = true;
      addMessage(threadId, "assistant", THREADS[threadId].docSummary);
      return stripMarkdown(THREADS[threadId].docSummary);
    }

    addMessage(threadId, "user", userMessage);

    const [contextSerialized, retrievedDocs] = await retrieve({ query: userMessage });

    const systemPrompt = new SystemMessage(
      "You are a helpful assistant that answers questions based only on the provided document context. " +
        "If the answer cannot be found in the context, respond that it is not available. " +
        "Do not hallucinate or make assumptions outside the document. " +
        "If the user's question is too general (e.g., 'What is in the document?' or 'Summarize the whole file'), " +
        "politely ask them to be more specific about which topic, section, or information in the PDF they want to know about. " +
        "Encourage the user to refer to particular details or keywords mentioned in the document."
    );

    const trimmedHistory = getTrimmedHistory(threadId, 6);
    const historyText = trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n");

    const MAX_CONTEXT_CHARS = 12_000;
    const contextForPrompt = (contextSerialized ?? "").length > MAX_CONTEXT_CHARS ? (contextSerialized ?? "").slice(0, MAX_CONTEXT_CHARS) + "\n\n[TRUNCATED]" : (contextSerialized ?? "");

    const userPromptText = `Context:\n${contextForPrompt}\n\nConversation history (latest):\n${historyText}\n\nUser question:\n${userMessage}\n\nAnswer concisely and cite Source lines where appropriate (e.g., "Source: <docId>"). If the information is not present in the context, say "Information not found in the provided documents."`;

    const userMsg = new HumanMessage(userPromptText);

    const res = await (model as any).invoke([systemPrompt, userMsg]);

    const replyRaw = res?.content ?? (res as any)?.text ?? JSON.stringify(res);
    const reply = stripMarkdown(replyRaw.toString?.() ?? String(replyRaw));

    addMessage(threadId, "assistant", reply);

    return reply;
  } catch (err: any) {
    console.error("RAG chat error:", err?.response?.status, err?.response?.data ?? err?.message);
    throw err;
  }
}

export function resetThread(threadId: string) {
  delete THREADS[threadId];
}
