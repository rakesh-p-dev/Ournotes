import { NextResponse } from "next/server";
import { ingestChunksToPinecone } from "../../../../langchain/ingest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { docId, chunks } = body;
    if (!docId || !chunks || !Array.isArray(chunks)) {
      return NextResponse.json({ error: "missing docId or chunks[]" }, { status: 400 });
    }

    const result = await ingestChunksToPinecone({ docId, chunks });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("upsert-chunks error", err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
