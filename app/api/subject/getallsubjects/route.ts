import { getServerSession } from "next-auth/next";
import { authentication } from '@/utils/auth';
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from '@/lib/noderedis';

export async function GET() {
  const session = await getServerSession(authentication);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const prisma = new PrismaClient();
  const cacheKey = 'allsubjects';
  const redis = await getRedisClient();
  // Uncomment below to enable caching
  const cachedSubjects = await redis.get(cacheKey);
  if (cachedSubjects) {
    return NextResponse.json({ subject: JSON.parse(cachedSubjects) });
  }
  const subject = await prisma.subject.findMany({
    include: {
      user: true,
      department: true
    }
  });
 
  await redis.set(cacheKey, JSON.stringify(subject));
  return NextResponse.json({ subject });
}  