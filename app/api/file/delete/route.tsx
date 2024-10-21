import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import {redis} from "@/lib/redis";  
import { getServerSession } from "next-auth/next"
import { authentication } from '@/utils/auth';
const s3client = new S3Client({
    region: process.env.AWS_S3_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || ''
    }
});const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
    try {
const session=await getServerSession(authentication);
if(!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
        const body = await request.json();
       
        const fileid = body.fileId;
        const filekey = body.fileKey;
        const subjectid=body.subjectId;
        
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filekey
        });
        const url = await getSignedUrl(s3client, command, { expiresIn: 60 });

       
        const deleteS3Response = await fetch(url, { method: 'DELETE' });

        if (!deleteS3Response.ok) {
            throw new Error(`Failed to delete object from S3: ${deleteS3Response.statusText}`);
        }

        
        const subject = await prisma.file.delete({
            where: {
                id: fileid,
                subjectId:subjectid
            }
        });

        if (subject) {
            const cacheKey = 'allsubjects';
    await redis.del(cacheKey);
            return NextResponse.json({ data: subject });
        } else {
            throw new Error('Failed to delete record from database');
        }
    } catch (e) {
        
        return NextResponse.json({
            error:  'An error occurred',
            e:{e},
            
        });
    }
}
