import { s3client } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import {redis} from '@/lib/redis';
import { getServerSession } from "next-auth/next"
import { authentication } from '@/utils/auth';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const session=await getServerSession(authentication);
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const file = formData.get("file");
        const userid = Number(formData.get("userid"));
        const subjectid = Number(formData.get("subjectid"));
      
       

       
        if (file && file instanceof File) {
            const fileType=file.type;
            const ex = (fileType as string).split("/")[1];
            const key = `${randomUUID()}.${ex}`;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: key,
                Expires: 60,
                ContentType: file.type || 'application/octet-stream', 
            };
            
         
            const uploadUrl = await s3client.getSignedUrlPromise("putObject", params);

            
            await prisma.file.create({
                data: {
                    filename: file.name,
                    fileurl: key,
                    userid: userid,
                    subjectId: subjectid,
                }
            });
            const cacheKey = 'allsubjects';
    await redis.del(cacheKey);

            return NextResponse.json({
                uploadUrl,
                Key: key
            }, { status: 200 });
        }
        
        return NextResponse.json({ error: "No file found." }, { status: 400 });
    } catch (e) {
        console.error("Error processing request:", e);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
