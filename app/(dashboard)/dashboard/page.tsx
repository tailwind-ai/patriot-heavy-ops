import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardShell } from "@/components/shell"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { OperatorDashboard } from "@/components/dashboard/operator-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export const metadata = {
  title: "Dashboard",
}

/**
 * Main Dashboard Page
 * 
 * Routes to role-specific dashboard components based on user role.
 * Provides platform-agnostic dashboard experience with mobile-first design.
 * 
 * Role-based routing:
 * - USER: UserDashboard - Service request tracking and creation
 * - OPERATOR: OperatorDashboard - Available jobs and active assignments
 * - MANAGER: ManagerDashboard - Approval queues and oversight tools
 * - ADMIN: AdminDashboard - System metrics and user management
 */
export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  // Determine which dashboard component to render based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case "OPERATOR":
        return <OperatorDashboard />
      case "MANAGER":
        return <ManagerDashboard />
      case "ADMIN":
        return <AdminDashboard />
      case "USER":
      default:
        return <UserDashboard />
    }
  }

  return (
    <DashboardShell>
      {renderDashboard()}
    </DashboardShell>
  )
}
