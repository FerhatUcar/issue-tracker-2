import prisma from "@/prisma/client";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { FacebookProfile } from "@/app/types/facebook";

function getFacebookImage(picture: FacebookProfile["picture"]): string | null {
  if (!picture) {
    return null;
  }

  return picture.data?.url ?? null;
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider<FacebookProfile>({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name ?? null,
          email: profile.email ?? null,
          image: getFacebookImage(profile.picture),
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },

    redirect({ baseUrl }) {
      return `${baseUrl}/workspaces`;
    },
  },
};

export default authOptions;
