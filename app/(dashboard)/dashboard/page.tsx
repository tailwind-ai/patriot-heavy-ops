import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardShell } from "@/components/shell"
import { DashboardWithNavigation } from "@/components/dashboard/dashboard-with-navigation"

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

  return (
    <DashboardShell>
      <DashboardWithNavigation user={user} />
    </DashboardShell>
  )
}
