import { NextRequest, NextResponse } from "next/server";
import { s3client } from "@/utils/utils";
import { getServerSession } from "next-auth/next"
import { authentication } from '@/utils/auth';

export async function POST(request: NextRequest) {
    try {
        const session=await getServerSession(authentication);
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const filekey = body.fileurl;
        const url = s3client.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${filekey}`,
            Expires: 60
        });
        return NextResponse.json({ data:url });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e,
            message: "this is the error"
        });
    }
}