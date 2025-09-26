"use client"

import { useRouter } from "next/navigation"
import { UserDashboard } from "./user-dashboard"
import { OperatorDashboard } from "./operator-dashboard"
import { ManagerDashboard } from "./manager-dashboard"
import { AdminDashboard } from "./admin-dashboard"

interface DashboardRouterProps {
  user: {
    role: string
    [key: string]: any
  }
}

/**
 * DashboardRouter Component
 * 
 * Client-side router that handles role-based dashboard rendering and navigation.
 * Separates server-side user fetching from client-side navigation logic.
 * 
 * This pattern maintains platform-agnostic design by:
 * - Keeping navigation logic in client components
 * - Using callback props for navigation actions
 * - Allowing easy substitution of navigation methods for different platforms
 */
export function DashboardRouter({ user }: DashboardRouterProps) {
  const router = useRouter()

  // Navigation handlers for platform-agnostic design
  const handleNavigateToCreateRequest = () => {
    router.push("/dashboard/requests/new")
  }

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
      return <UserDashboard onNavigateToCreateRequest={handleNavigateToCreateRequest} />
  }
}
