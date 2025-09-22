import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  // Handle empty string case
  if (path === '') {
    return env.NEXT_PUBLIC_APP_URL
  }
  
  // Ensure path starts with a slash for proper URL construction
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${env.NEXT_PUBLIC_APP_URL}${normalizedPath}`
}
