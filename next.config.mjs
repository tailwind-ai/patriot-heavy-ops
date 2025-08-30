import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
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
