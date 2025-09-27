import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_ACCESS_TOKEN: z.string().min(1).optional(),
    DATABASE_URL: z.string().min(1),
    PRISMA_DATABASE_URL: z.string().min(1).optional(),
    SMTP_FROM: z.string().min(1).optional(),
    POSTMARK_API_TOKEN: z.string().min(1).optional(),
    POSTMARK_SIGN_IN_TEMPLATE: z.string().min(1).optional(),
    POSTMARK_ACTIVATION_TEMPLATE: z.string().min(1).optional(),
    STRIPE_API_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
    STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1).optional(),
    GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
    CURSOR_API_KEY: z.string().min(1).optional(),
    CURSOR_CLI: z.string().min(1).optional(),
    VERCEL_API_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL,
    SMTP_FROM: process.env.SMTP_FROM,
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    POSTMARK_SIGN_IN_TEMPLATE: process.env.POSTMARK_SIGN_IN_TEMPLATE,
    POSTMARK_ACTIVATION_TEMPLATE: process.env.POSTMARK_ACTIVATION_TEMPLATE,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRO_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
    CURSOR_API_KEY: process.env.CURSOR_API_KEY,
    CURSOR_CLI: process.env.CURSOR_CLI,
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
