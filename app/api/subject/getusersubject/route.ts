import { PrismaClient } from "@prisma/client";
import {redis} from '@/lib/redis';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authentication } from '@/utils/auth';
export async function GET(request: NextRequest) {
  const session=await getServerSession(authentication)
  if(!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cookies = request.cookies;
  const userid = cookies.get('userId')?.value;
  const prisma = new PrismaClient();
  // const cacheKey=`allsubjects:${userid}`;
  // const cacheduserSubjects=await redis.get(cacheKey);
  // if(cacheduserSubjects){
  //   return NextResponse.json({subject:JSON.parse(cacheduserSubjects)});
  // }
  const subject = await prisma.subject.findMany({
    where: {
      userId: Number(userid),
    },
    include:{
      user:true,
      department:true
    }
  });
  // await redis.set(cacheKey,JSON.stringify(subject)
  // );
  
  return NextResponse.json({subject});
}   