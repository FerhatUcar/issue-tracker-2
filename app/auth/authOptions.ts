import prisma from "@/prisma/client";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { FacebookProfile } from "@/app/types/facebook";

function getFacebookImage(picture: FacebookProfile["picture"]): string | null {
  if (!picture) return null;
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
      allowDangerousEmailAccountLinking: true,
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
    async signIn({ user, account }) {
      if (!account || account.type !== "oauth") {
        return true;
      }

      const email = user.email;

      if (!email) {
        return true;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {
            access_token: account.access_token ?? undefined,
            refresh_token: account.refresh_token ?? undefined,
            expires_at: account.expires_at ?? undefined,
            token_type: account.token_type ?? undefined,
            scope: account.scope ?? undefined,
            id_token: account.id_token ?? undefined,
            session_state: account.session_state ?? undefined,
          },
          create: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token ?? null,
            refresh_token: account.refresh_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: account.session_state ?? null,
          },
        });

        return true;
      }

      return true;
    },

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
