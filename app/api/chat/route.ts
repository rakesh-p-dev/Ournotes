import { NextResponse } from 'next/server';
import { runAgent } from '../../../langchain/agent';

export async function POST(request: Request) {

    const body = await request.json();
    const message = body?.message || "";

    const reply = await runAgent(message);


    return NextResponse.json({ reply });

}
