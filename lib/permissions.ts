export type Permission =
  // User (General Contractor) permissions
  | 'submit_requests'
  | 'view_own_requests'
  | 'edit_own_requests'
  | 'delete_own_requests'
  | 'apply_to_become_operator'
  
  // Operator permissions
  | 'view_assignments'
  | 'accept_assignments'
  | 'decline_assignments'
  | 'update_assignment_progress'
  | 'complete_assignments'
  | 'manage_operator_profile'
  | 'update_availability'
  | 'view_operator_dashboard'
  
  // Manager permissions
  | 'review_requests'
  | 'approve_requests'
  | 'reject_requests'
  | 'assign_operators'
  | 'reassign_operators'
  | 'track_all_progress'
  | 'handle_billing'
  | 'view_all_requests'
  | 'manage_request_status'
  | 'view_manager_dashboard'
  | 'override_assignments'
  
  // Admin permissions
  | 'manage_users'
  | 'manage_roles'
  | 'approve_operator_applications'
  | 'reject_operator_applications'
  | 'system_settings'
  | 'view_all_data'
  | 'manage_permissions'
  | 'view_admin_dashboard'
  | 'delete_any_request'
  | 'modify_any_request'
  | 'access_financial_data'
  | 'manage_system_config'

export type UserRole = 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [
    'submit_requests',
    'view_own_requests',
    'edit_own_requests',
    'delete_own_requests',
    'apply_to_become_operator'
  ],
  OPERATOR: [
    'view_assignments',
    'accept_assignments',
    'decline_assignments',
    'update_assignment_progress',
    'complete_assignments',
    'manage_operator_profile',
    'update_availability',
    'view_operator_dashboard',
    // Operators can also submit requests as regular users
    'submit_requests',
    'view_own_requests',
    'edit_own_requests',
    'delete_own_requests'
  ],
  MANAGER: [
    'review_requests',
    'approve_requests',
    'reject_requests',
    'assign_operators',
    'reassign_operators',
    'track_all_progress',
    'handle_billing',
    'view_all_requests',
    'manage_request_status',
    'view_manager_dashboard',
    'override_assignments',
    // Managers inherit operator permissions
    'view_assignments',
    'accept_assignments',
    'decline_assignments',
    'update_assignment_progress',
    'complete_assignments',
    'manage_operator_profile',
    'update_availability',
    'view_operator_dashboard',
    // Managers can also submit requests as regular users
    'submit_requests',
    'view_own_requests',
    'edit_own_requests',
    'delete_own_requests'
  ],
  ADMIN: [
    'manage_users',
    'manage_roles',
    'approve_operator_applications',
    'reject_operator_applications',
    'system_settings',
    'view_all_data',
    'manage_permissions',
    'view_admin_dashboard',
    'delete_any_request',
    'modify_any_request',
    'access_financial_data',
    'manage_system_config',
    // Admins inherit all lower-level permissions
    'review_requests',
    'approve_requests',
    'reject_requests',
    'assign_operators',
    'reassign_operators',
    'track_all_progress',
    'handle_billing',
    'view_all_requests',
    'manage_request_status',
    'view_manager_dashboard',
    'override_assignments',
    'view_assignments',
    'accept_assignments',
    'decline_assignments',
    'update_assignment_progress',
    'complete_assignments',
    'manage_operator_profile',
    'update_availability',
    'view_operator_dashboard',
    'submit_requests',
    'view_own_requests',
    'edit_own_requests',
    'delete_own_requests',
    'apply_to_become_operator'
  ]
}

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

/**
 * Get all permissions for a user role
 */
export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Define route access rules
  const routePermissions: Record<string, Permission[]> = {
    // User routes
    '/dashboard': ['view_own_requests'],
    '/dashboard/requests': ['view_own_requests'],
    '/dashboard/requests/new': ['submit_requests'],
    '/dashboard/settings': [], // All authenticated users can access settings
    '/dashboard/billing': [], // All authenticated users can access billing
    
    // Operator routes
    '/dashboard/operator': ['view_operator_dashboard'],
    '/dashboard/operator/assignments': ['view_assignments'],
    '/dashboard/operator/profile': ['manage_operator_profile'],
    '/dashboard/operator/availability': ['update_availability'],
    
    // Manager routes
    '/dashboard/manager': ['view_manager_dashboard'],
    '/dashboard/manager/requests': ['review_requests'],
    '/dashboard/manager/assignments': ['assign_operators'],
    '/dashboard/manager/progress': ['track_all_progress'],
    
    // Admin routes
    '/dashboard/admin': ['view_admin_dashboard'],
    '/dashboard/admin/users': ['manage_users'],
    '/dashboard/admin/operators': ['approve_operator_applications'],
    '/dashboard/admin/requests': ['view_all_requests'],
    '/dashboard/admin/settings': ['system_settings'],
    '/dashboard/admin/analytics': ['view_all_data']
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // Public route or no specific requirements

  // If no permissions required, allow all authenticated users
  if (requiredPermissions.length === 0) return true

  // Check if user has at least one of the required permissions
  return requiredPermissions.some(permission => hasPermission(userRole, permission))
}

/**
 * Role hierarchy for comparison
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  OPERATOR: 2,
  MANAGER: 3,
  ADMIN: 4
}

/**
 * Check if user role is higher than target role
 */
export function hasHigherRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole]
}

/**
 * Check if user role is equal or higher than target role
 */
export function hasEqualOrHigherRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole]
}

/**
 * Get roles that are lower than the given role
 */
export function getLowerRoles(userRole: UserRole): UserRole[] {
  const currentLevel = ROLE_HIERARCHY[userRole]
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level < currentLevel)
    .map(([role]) => role as UserRole)
}

/**
 * Check if user can manage another user based on role hierarchy
 */
export function canManageUser(managerRole: UserRole, targetUserRole: UserRole): boolean {
  // Admins can manage everyone
  if (managerRole === 'ADMIN') return true
  
  // Managers can manage users and operators
  if (managerRole === 'MANAGER') {
    return targetUserRole === 'USER' || targetUserRole === 'OPERATOR'
  }
  
  // Users and operators cannot manage other users
  return false
}

/**
 * Get available dashboard routes for a user role
 */
export function getAvailableDashboardRoutes(userRole: UserRole): Array<{
  title: string
  href: string
  icon: string
  description?: string
}> {
  const baseRoutes = [
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

  const roleSpecificRoutes: Record<UserRole, Array<{
    title: string
    href: string
    icon: string
    description?: string
  }>> = {
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
        icon: "settings",
        description: "Configure system settings"
      }
    ]
  }

  return [...baseRoutes, ...roleSpecificRoutes[userRole]]
}