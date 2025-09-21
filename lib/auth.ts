import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Client } from "postmark"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-utils"

const postmarkClient = new Client(env.POSTMARK_API_TOKEN || "")

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  // adapter: PrismaAdapter(db as any),
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
  trustHost: true,
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
            console.log("Missing credentials")
            return null
          }

          console.log("Attempting to authenticate:", credentials.email)

          // First check if user exists without loading password
          const userExists = await db.user.findUnique({
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
            console.log("User not found:", credentials.email)
            return null
          }

          // Get password hash separately for verification
          const passwordData = await db.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              password: true,
            },
          })

          if (!passwordData?.password) {
            console.log("User has no password set")
            return null
          }

          const isValid = await verifyPassword(credentials.password, passwordData.password)

          if (!isValid) {
            console.log("Invalid password for:", credentials.email)
            return null
          }

          console.log("Authentication successful for:", credentials.email)
          return {
            id: userExists.id,
            email: userExists.email,
            name: userExists.name,
            image: userExists.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
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
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
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
