// route.ts (or route.js / route.tsx) — keep filename according to Next app router rules
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { parsePdfBufferToDocs } from "../../../../langchain/pdfloader";
import { summarizeChunks } from "../../../../langchain/agent";
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "only multipart/form-data with a 'file' field is accepted" },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "missing file field" }, { status: 400 });
    }

    if (!(file instanceof Blob) && typeof (file as any).arrayBuffer !== "function") {
   
      return NextResponse.json({ error: "invalid file uploaded" }, { status: 400 });
    }

    const filename = (file as any).name ?? "unknown";
    const buffer = await file.arrayBuffer();

    const docs = await parsePdfBufferToDocs(buffer, filename, {
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = docs.map(d => d.pageContent);
    const summary = await summarizeChunks(chunks);

    const previews = docs.map((d) => ({
      pageContentPreview: d.pageContent.slice(0, 1000),
      metadata: d.metadata,
    }));

    return NextResponse.json({
      ok: true,
      docsCount: docs.length,
      docs,
      summary

    });
  } catch (err: any) {
    console.error("parse-embed error:", err?.stack ?? err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
