import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-utils"

export const authOptions: NextAuthOptions = {
  // Note: PrismaAdapter disabled while using Credentials provider only
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  // adapter: PrismaAdapter(db),
  // Note: keep adapter disabled while only the Credentials provider is active.
  // Re-enable when adding OAuth/email providers that require persistence.
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // First check if user exists without loading password
          const userExists = await db?.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          })

          if (!userExists) {
            return null
          }

          // Get password hash separately for verification
          const passwordData = await db?.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              password: true,
            },
          })

          if (!passwordData?.password) {
            return null
          }

          const isValid = await verifyPassword(
            credentials.password,
            passwordData.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: userExists.id,
            email: userExists.email,
            name: userExists.name,
            image: userExists.image,
          }
        } catch {
          return null
        }
      },
    }),
    // GitHubProvider can be enabled when configured
    // GitHubProvider({
    //   clientId: env.GITHUB_CLIENT_ID || "",
    //   clientSecret: env.GITHUB_CLIENT_SECRET || "",
    // }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name ?? null
        session.user.email = token.email ?? null
        session.user.image = token.picture ?? null
        session.user.role = token.role
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = token.email
        ? await db.user.findUnique({
            where: {
              email: token.email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          })
        : null

      if (!dbUser) {
        if (user) {
          token.id = user?.id
          // Default role for new users
          token.role = "USER"
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      }
    },
  },
}
