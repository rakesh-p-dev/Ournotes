import { NextRequest, NextResponse } from "next/server";
import { s3client } from "@/utils/utils";
import { getServerSession } from "next-auth/next"
import { authentication } from '@/utils/auth';
import { cacheMiddleware, setCache, generateCacheKey } from '@/utils/redis';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authentication);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const filekey = body.fileurl;

        // Generate cache key
        const cacheKey = generateCacheKey('file-download', { filekey });

        // Check cache first
        const cachedUrl = await cacheMiddleware(cacheKey, 300); // Cache for 5 minutes
        if (cachedUrl) {
            return NextResponse.json({ data: cachedUrl, fromCache: true });
        }

        // If not in cache, generate new signed URL
        const url = s3client.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${filekey}`,
            Expires: 60
        });

        // Cache the URL
        await setCache(cacheKey, url, 300); // Cache for 5 minutes

        return NextResponse.json({ data: url, fromCache: false });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e,
            message: "this is the error"
        });
    }
}