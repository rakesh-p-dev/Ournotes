import * as z from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { embeddings } from "./ingest"; 

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });
const pineconeIndex = pinecone.index("ournotes");
const vectorStore = new PineconeStore(embeddings, { pineconeIndex });

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY ?? "",
});


export async function retrieve({ query }: { query: string }) {
  const retrievedDocs = await (vectorStore as any).similaritySearch(query, 2);

  const serialized = retrievedDocs
    .map(
      (doc: any) => `Source: ${doc.metadata?.docId ?? "unknown"}\nContent: ${doc.pageContent}`
    )
    .join("\n\n");
  return [serialized, retrievedDocs] as const;
}

const tools = [retrieve];

const systemPrompt = "You have access to a tool that retrieves context from uploaded documents. Use the tool to help answer user queries based on the retrieved content.";

const agent = createAgent({ model, tools, systemPrompt });

export async function runAgent(inputMessage: string) {
  const agentInputs = { messages: [{ role: "user", content: inputMessage }] };

  const stream = await agent.stream(agentInputs, {
    streamMode: "values",
  });

  let fullResponse = "";
  for await (const step of stream) {
    const lastMessage = step.messages[step.messages.length - 1];
    if (lastMessage.role === "assistant") {
      fullResponse = lastMessage.content;
    }
  }
  return fullResponse;
}
