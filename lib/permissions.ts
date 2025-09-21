export type Permission = 
  | 'submit_requests'
  | 'view_own_requests' 
  | 'edit_own_requests'
  | 'view_assignments'
  | 'update_availability'
  | 'manage_profile'
  | 'review_requests'
  | 'assign_operators'
  | 'track_progress'
  | 'handle_billing'
  | 'view_all_requests'
  | 'manage_users'
  | 'manage_roles'
  | 'system_settings'
  | 'view_all_data'
  | 'manage_permissions'

export type UserRole = 'USER' | 'OPERATOR' | 'MANAGER' | 'ADMIN'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [
    'submit_requests',
    'view_own_requests', 
    'edit_own_requests'
  ],
  OPERATOR: [
    'view_assignments',
    'update_availability',
    'manage_profile'
  ],
  MANAGER: [
    'review_requests',
    'assign_operators', 
    'track_progress',
    'handle_billing',
    'view_all_requests'
  ],
  ADMIN: [
    'manage_users',
    'manage_roles',
    'system_settings',
    'view_all_data',
    'manage_permissions',
    // Admins inherit all lower-level permissions
    'review_requests',
    'assign_operators',
    'track_progress', 
    'handle_billing',
    'view_all_requests',
    'view_assignments',
    'update_availability',
    'manage_profile',
    'submit_requests',
    'view_own_requests',
    'edit_own_requests'
  ]
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Define route access rules
  const routePermissions: Record<string, Permission[]> = {
    '/dashboard': ['view_own_requests'],
    '/dashboard/requests': ['view_own_requests'],
    '/dashboard/requests/new': ['submit_requests'],
    '/dashboard/admin': ['view_all_requests'],
    '/dashboard/admin/requests': ['review_requests'],
    '/dashboard/admin/users': ['manage_users'],
    '/dashboard/operator': ['view_assignments'],
    '/dashboard/manager': ['review_requests']
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // Public route

  return requiredPermissions.some(permission => hasPermission(userRole, permission))
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  OPERATOR: 2, 
  MANAGER: 3,
  ADMIN: 4
}

export function hasHigherRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole]
}
