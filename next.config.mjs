import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail production builds on ESLint errors (Vercel)
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  // Fix for client reference manifest issues
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
