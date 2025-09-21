import { DashboardConfig } from "types"
import { UserRole } from "@/lib/permissions"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Service Requests",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}

// Role-specific navigation configurations
export const getRoleBasedSidebarNav = (userRole: UserRole) => {
  const baseNav = [
    {
      title: "Service Requests",
      href: "/dashboard",
      icon: "post",
      description: "Manage your service requests"
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      description: "Account and profile settings"
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
      description: "Billing and subscription management"
    }
  ]

  const roleSpecificNav = {
    USER: [],
    OPERATOR: [
      {
        title: "My Assignments",
        href: "/dashboard/operator/assignments",
        icon: "briefcase",
        description: "View and manage job assignments"
      },
      {
        title: "Operator Profile",
        href: "/dashboard/operator/profile",
        icon: "user",
        description: "Manage equipment and certifications"
      }
    ],
    MANAGER: [
      {
        title: "Request Management",
        href: "/dashboard/manager/requests",
        icon: "clipboard",
        description: "Review and approve service requests"
      },
      {
        title: "Operator Assignment",
        href: "/dashboard/manager/assignments",
        icon: "users",
        description: "Assign operators to jobs"
      },
      {
        title: "Progress Tracking",
        href: "/dashboard/manager/progress",
        icon: "activity",
        description: "Monitor job progress"
      }
    ],
    ADMIN: [
      {
        title: "User Management",
        href: "/dashboard/admin/users",
        icon: "users",
        description: "Manage users and roles"
      },
      {
        title: "Operator Applications",
        href: "/dashboard/admin/operators",
        icon: "userCheck",
        description: "Review operator applications"
      },
      {
        title: "System Analytics",
        href: "/dashboard/admin/analytics",
        icon: "barChart",
        description: "View system metrics and reports"
      },
      {
        title: "System Settings",
        href: "/dashboard/admin/settings",
        icon: "settings2",
        description: "Configure system settings"
      }
    ]
  }

  return [...baseNav, ...roleSpecificNav[userRole]]
}
