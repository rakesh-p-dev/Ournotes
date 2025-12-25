import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';
import { setCookie } from './setcookie';

const prisma = new PrismaClient();

const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please check your .env.local file and ensure all required variables are set.');
}

export const authentication = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async signIn({ user, account }: any) {
      if (!user?.email) return false;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
            }
          });
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.uid;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: session.user.email
          }
        });

        if (existingUser) {
          await setCookie('userId', existingUser.id.toString());
          if (typeof window !== 'undefined') {
            localStorage.setItem('userId', existingUser.id.toString());
          }
        }
      } catch (error) {
        console.error('Error in session callback:', error);
      }

      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (typeof url === 'string') {
        if (url.startsWith('/')) return url;
        if (url.startsWith(baseUrl)) return url;
      }
      return '/dashboard/explore';
    },
  }
};

