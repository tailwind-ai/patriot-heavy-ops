"use client"

import { DashboardWithNavigation } from "./dashboard-with-navigation"
import { createToastNotifications } from "@/lib/utils/notifications"
import { toast } from "@/components/ui/use-toast"

type DashboardWithNotificationsProps = {
  user: {
    role: string
    id?: string
    name?: string | null
    email?: string | null
  }
}

/**
 * DashboardWithNotifications Component
 * 
 * Next.js-specific wrapper that provides both navigation and notification capabilities
 * to the platform-agnostic dashboard components. This component bridges the gap between
 * the platform-agnostic hooks and Next.js-specific UI libraries.
 * 
 * For React Native, create a similar wrapper that uses React Native's Alert or
 * a React Native toast library instead of the Next.js toast system.
 */
export function DashboardWithNotifications({ user }: DashboardWithNotificationsProps) {
  // Create Next.js-specific notification callbacks
  const notifications = createToastNotifications(toast)

  return (
    <DashboardWithNavigation 
      user={user} 
      notifications={notifications}
    />
  )
}
