
import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export type Doc = {
  pageContent: string;
  metadata: Record<string, any>;
};

export async function parsePdfBufferToDocs(
  buffer: ArrayBuffer | Buffer,
  filename?: string,
  opts?: { chunkSize?: number; chunkOverlap?: number }
): Promise<Doc[]> {
 
  const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);

  const data = await pdfParse(nodeBuffer as Buffer);
  const text = data?.text ?? "";

  const docs: Doc[] = [
    {
      pageContent: text,
      metadata: {
        filename: filename || null,
        info: data?.info ?? null,
      },
    },
  ];


  const chunkSize = opts?.chunkSize ?? 1000;
  const chunkOverlap = opts?.chunkOverlap ?? 200;

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap });


  const splits = await splitter.splitDocuments(docs as any);

  const normalized: Doc[] = splits.map((d: any) => ({ pageContent: d.pageContent, metadata: d.metadata || {} }));
  return normalized;
}
