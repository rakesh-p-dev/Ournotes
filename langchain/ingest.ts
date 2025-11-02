
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004"
});

interface Document {
  pageContent: string;
  metadata: Record<string, any>;
}

export async function ingestChunksToPinecone({
  docId,
  chunks,
  indexName ="ournotes",
}: {
  docId: string;
  chunks: string[];
  indexName?: string;
}) {
  if (!chunks || chunks.length === 0) return { docId, chunks: 0 };

  
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });
  const pineconeIndex = pinecone.index(indexName);
  const vectorStore = new PineconeStore(embeddings, { pineconeIndex });

  const documents = chunks.map((chunk, idx) => ({
    pageContent: chunk,
    metadata: { docId, chunkIndex: idx, text: chunk },
  }));
 await vectorStore.addDocuments(documents);

  return { docId, chunks: chunks.length, upserted: chunks.length };
}