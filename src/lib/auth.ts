import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/drizzle/client";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { user } from "@/lib/drizzle/schema";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [existingUser] = await db
          .select()
          .from(user)
          .where(eq(user.email, credentials.email))
          .limit(1);

        if (!existingUser) {
          return null;
        }

        if (!existingUser.password) {
          return null;
        }

        const isValid = await compare(credentials.password, existingUser.password);

        if (!isValid) {
          return null;
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};
