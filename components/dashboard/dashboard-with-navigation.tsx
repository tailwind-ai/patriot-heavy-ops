"use client"

import { useRouter } from "next/navigation"
import { DashboardRouter } from "./dashboard-router"

interface DashboardWithNavigationProps {
  user: {
    role: string
    id?: string
    name?: string | null
    email?: string | null
  }
}

/**
 * DashboardWithNavigation Component
 * 
 * Next.js-specific wrapper that provides navigation handlers to the platform-agnostic DashboardRouter.
 * This separation allows the core dashboard logic to remain platform-agnostic while providing
 * Next.js-specific navigation implementation.
 * 
 * For React Native, create a similar wrapper that uses React Navigation instead.
 */
export function DashboardWithNavigation({ user }: DashboardWithNavigationProps) {
  const router = useRouter()

  // Next.js-specific navigation handlers
  const handleNavigateToCreateRequest = () => {
    router.push("/dashboard/requests/new")
  }

  const handleNavigateToOperatorJobs = () => {
    router.push("/dashboard/operator/jobs")
  }

  const handleNavigateToManagerQueue = () => {
    router.push("/dashboard/manager/queue")
  }

  const handleNavigateToAdminPanel = () => {
    router.push("/dashboard/admin")
  }

  return (
    <DashboardRouter
      user={user}
      onNavigateToCreateRequest={handleNavigateToCreateRequest}
      onNavigateToOperatorJobs={handleNavigateToOperatorJobs}
      onNavigateToManagerQueue={handleNavigateToManagerQueue}
      onNavigateToAdminPanel={handleNavigateToAdminPanel}
    />
  )
}
