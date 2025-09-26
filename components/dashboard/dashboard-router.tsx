"use client"

import { UserDashboard } from "./user-dashboard"
import { OperatorDashboard } from "./operator-dashboard"
import { ManagerDashboard } from "./manager-dashboard"
import { AdminDashboard } from "./admin-dashboard"

interface DashboardRouterProps {
  user: {
    role: string
    id?: string
    name?: string | null
    email?: string | null
  }
  onNavigateToCreateRequest?: () => void
  onNavigateToOperatorJobs?: () => void
  onNavigateToManagerQueue?: () => void
  onNavigateToAdminPanel?: () => void
}

/**
 * DashboardRouter Component
 *
 * Platform-agnostic router that handles role-based dashboard rendering.
 * Separates server-side user fetching from client-side navigation logic.
 *
 * This pattern maintains platform-agnostic design by:
 * - Using callback props for all navigation actions
 * - No direct dependency on Next.js router or React Native navigation
 * - Allowing parent components to handle navigation appropriately for their platform
 *
 * Usage:
 * - Next.js: Pass router.push callbacks
 * - React Native: Pass navigation.navigate callbacks
 * - Testing: Pass mock functions
 */
export function DashboardRouter({
  user,
  onNavigateToCreateRequest,
}: // Future navigation handlers for other dashboard types
// onNavigateToOperatorJobs,
// onNavigateToManagerQueue,
// onNavigateToAdminPanel
DashboardRouterProps) {
  // Determine which dashboard component to render based on user role
  switch (user.role) {
    case "OPERATOR":
      return <OperatorDashboard />
    case "MANAGER":
      return <ManagerDashboard />
    case "ADMIN":
      return <AdminDashboard />
    case "USER":
    default:
      return (
        <UserDashboard
          onNavigateToCreateRequest={onNavigateToCreateRequest || undefined}
        />
      )
  }
}
