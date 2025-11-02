import { NextResponse } from 'next/server';
import { runAgent } from '../../../langchain/agent';

export async function POST(request: Request) {

    const body = await request.json();
    const message = body?.message || "";

    const reply = await runAgent(message);

    console.log("Agent reply:", reply);

    return NextResponse.json({ reply });

}
