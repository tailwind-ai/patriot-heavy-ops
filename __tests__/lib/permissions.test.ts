import {
  Permission,
  UserRole,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  getUserPermissions,
  canAccessRoute,
  hasHigherRole,
  hasEqualOrHigherRole,
  getLowerRoles,
  canManageUser,
  getAvailableDashboardRoutes
} from '@/lib/permissions'

describe('Permissions System', () => {
  describe('ROLE_PERMISSIONS constant', () => {
    it('should have permissions for all roles', () => {
      const expectedRoles: UserRole[] = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN']
      
      expectedRoles.forEach(role => {
        expect(ROLE_PERMISSIONS[role]).toBeDefined()
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true)
        expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0)
      })
    })

    it('should have proper permission inheritance', () => {
      // USER permissions should be included in OPERATOR (except apply_to_become_operator)
      const userPermissions = ROLE_PERMISSIONS.USER
      const operatorPermissions = ROLE_PERMISSIONS.OPERATOR
      
      const userPermissionsExceptApply = userPermissions.filter(p => p !== 'apply_to_become_operator')
      userPermissionsExceptApply.forEach(permission => {
        expect(operatorPermissions).toContain(permission)
      })

      // OPERATOR permissions should be included in MANAGER
      const managerPermissions = ROLE_PERMISSIONS.MANAGER
      
      operatorPermissions.forEach(permission => {
        expect(managerPermissions).toContain(permission)
      })

      // MANAGER permissions should be included in ADMIN
      const adminPermissions = ROLE_PERMISSIONS.ADMIN
      
      managerPermissions.forEach(permission => {
        expect(adminPermissions).toContain(permission)
      })
    })

    it('should have unique permissions per role level', () => {
      // USER should have basic permissions
      expect(ROLE_PERMISSIONS.USER).toContain('submit_requests')
      expect(ROLE_PERMISSIONS.USER).toContain('view_own_requests')
      expect(ROLE_PERMISSIONS.USER).toContain('apply_to_become_operator')

      // OPERATOR should have operator-specific permissions
      expect(ROLE_PERMISSIONS.OPERATOR).toContain('view_assignments')
      expect(ROLE_PERMISSIONS.OPERATOR).toContain('accept_assignments')
      expect(ROLE_PERMISSIONS.OPERATOR).toContain('manage_operator_profile')

      // MANAGER should have management permissions
      expect(ROLE_PERMISSIONS.MANAGER).toContain('review_requests')
      expect(ROLE_PERMISSIONS.MANAGER).toContain('approve_requests')
      expect(ROLE_PERMISSIONS.MANAGER).toContain('assign_operators')

      // ADMIN should have admin permissions
      expect(ROLE_PERMISSIONS.ADMIN).toContain('manage_users')
      expect(ROLE_PERMISSIONS.ADMIN).toContain('manage_roles')
      expect(ROLE_PERMISSIONS.ADMIN).toContain('system_settings')
    })
  })

  describe('hasPermission function', () => {
    it('should return true for valid role-permission combinations', () => {
      // Test USER permissions
      expect(hasPermission('USER', 'submit_requests')).toBe(true)
      expect(hasPermission('USER', 'view_own_requests')).toBe(true)
      expect(hasPermission('USER', 'apply_to_become_operator')).toBe(true)

      // Test OPERATOR permissions
      expect(hasPermission('OPERATOR', 'view_assignments')).toBe(true)
      expect(hasPermission('OPERATOR', 'accept_assignments')).toBe(true)
      expect(hasPermission('OPERATOR', 'submit_requests')).toBe(true) // Inherited

      // Test MANAGER permissions
      expect(hasPermission('MANAGER', 'review_requests')).toBe(true)
      expect(hasPermission('MANAGER', 'assign_operators')).toBe(true)
      expect(hasPermission('MANAGER', 'view_assignments')).toBe(true) // Inherited

      // Test ADMIN permissions
      expect(hasPermission('ADMIN', 'manage_users')).toBe(true)
      expect(hasPermission('ADMIN', 'system_settings')).toBe(true)
      expect(hasPermission('ADMIN', 'review_requests')).toBe(true) // Inherited
    })

    it('should return false for invalid role-permission combinations', () => {
      // USER should not have higher-level permissions
      expect(hasPermission('USER', 'view_assignments')).toBe(false)
      expect(hasPermission('USER', 'review_requests')).toBe(false)
      expect(hasPermission('USER', 'manage_users')).toBe(false)

      // OPERATOR should not have manager/admin permissions
      expect(hasPermission('OPERATOR', 'review_requests')).toBe(false)
      expect(hasPermission('OPERATOR', 'assign_operators')).toBe(false)
      expect(hasPermission('OPERATOR', 'manage_users')).toBe(false)

      // MANAGER should not have admin permissions
      expect(hasPermission('MANAGER', 'manage_users')).toBe(false)
      expect(hasPermission('MANAGER', 'system_settings')).toBe(false)
    })

    it('should handle invalid permissions gracefully', () => {
      expect(hasPermission('USER', 'invalid_permission' as Permission)).toBe(false)
      expect(hasPermission('ADMIN', 'nonexistent_permission' as Permission)).toBe(false)
    })

    it('should handle invalid roles gracefully', () => {
      expect(hasPermission('INVALID_ROLE' as UserRole, 'submit_requests')).toBe(false)
    })
  })

  describe('getUserPermissions function', () => {
    it('should return correct permissions for each role', () => {
      const userPermissions = getUserPermissions('USER')
      const operatorPermissions = getUserPermissions('OPERATOR')
      const managerPermissions = getUserPermissions('MANAGER')
      const adminPermissions = getUserPermissions('ADMIN')

      // Check that USER has fewer permissions than OPERATOR
      expect(userPermissions.length).toBeLessThan(operatorPermissions.length)
      
      // Check that OPERATOR has fewer permissions than MANAGER
      expect(operatorPermissions.length).toBeLessThan(managerPermissions.length)
      
      // Check that MANAGER has fewer permissions than ADMIN
      expect(managerPermissions.length).toBeLessThan(adminPermissions.length)

      // Verify specific permissions exist
      expect(userPermissions).toContain('submit_requests')
      expect(operatorPermissions).toContain('view_assignments')
      expect(managerPermissions).toContain('review_requests')
      expect(adminPermissions).toContain('manage_users')
    })

    it('should return empty array for invalid role', () => {
      expect(getUserPermissions('INVALID_ROLE' as UserRole)).toEqual([])
    })

    it('should return arrays without duplicates', () => {
      const roles: UserRole[] = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN']
      
      roles.forEach(role => {
        const permissions = getUserPermissions(role)
        const uniquePermissions = [...new Set(permissions)]
        expect(permissions).toEqual(uniquePermissions)
      })
    })
  })

  describe('canAccessRoute function', () => {
    describe('public and general routes', () => {
      it('should allow access to routes with no specific requirements', () => {
        const roles: UserRole[] = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN']
        
        roles.forEach(role => {
          expect(canAccessRoute(role, '/dashboard/settings')).toBe(true)
          expect(canAccessRoute(role, '/dashboard/billing')).toBe(true)
        })
      })

      it('should allow access to undefined routes (public routes)', () => {
        const roles: UserRole[] = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN']
        
        roles.forEach(role => {
          expect(canAccessRoute(role, '/public-route')).toBe(true)
          expect(canAccessRoute(role, '/unknown-route')).toBe(true)
        })
      })
    })

    describe('user-level routes', () => {
      it('should allow users to access basic dashboard routes', () => {
        expect(canAccessRoute('USER', '/dashboard')).toBe(true)
        expect(canAccessRoute('USER', '/dashboard/requests')).toBe(true)
        expect(canAccessRoute('USER', '/dashboard/requests/new')).toBe(true)
      })

      it('should prevent users from accessing higher-level routes', () => {
        expect(canAccessRoute('USER', '/dashboard/operator')).toBe(false)
        expect(canAccessRoute('USER', '/dashboard/manager')).toBe(false)
        expect(canAccessRoute('USER', '/dashboard/admin')).toBe(false)
      })
    })

    describe('operator-level routes', () => {
      it('should allow operators to access operator routes', () => {
        expect(canAccessRoute('OPERATOR', '/dashboard/operator')).toBe(true)
        expect(canAccessRoute('OPERATOR', '/dashboard/operator/assignments')).toBe(true)
        expect(canAccessRoute('OPERATOR', '/dashboard/operator/profile')).toBe(true)
        expect(canAccessRoute('OPERATOR', '/dashboard/operator/availability')).toBe(true)
      })

      it('should allow operators to access user routes (inheritance)', () => {
        expect(canAccessRoute('OPERATOR', '/dashboard')).toBe(true)
        expect(canAccessRoute('OPERATOR', '/dashboard/requests')).toBe(true)
        expect(canAccessRoute('OPERATOR', '/dashboard/requests/new')).toBe(true)
      })

      it('should prevent operators from accessing manager/admin routes', () => {
        expect(canAccessRoute('OPERATOR', '/dashboard/manager')).toBe(false)
        expect(canAccessRoute('OPERATOR', '/dashboard/admin')).toBe(false)
      })
    })

    describe('manager-level routes', () => {
      it('should allow managers to access manager routes', () => {
        expect(canAccessRoute('MANAGER', '/dashboard/manager')).toBe(true)
        expect(canAccessRoute('MANAGER', '/dashboard/manager/requests')).toBe(true)
        expect(canAccessRoute('MANAGER', '/dashboard/manager/assignments')).toBe(true)
        expect(canAccessRoute('MANAGER', '/dashboard/manager/progress')).toBe(true)
      })

      it('should allow managers to access lower-level routes (inheritance)', () => {
        expect(canAccessRoute('MANAGER', '/dashboard/operator')).toBe(true)
        expect(canAccessRoute('MANAGER', '/dashboard')).toBe(true)
      })

      it('should prevent managers from accessing admin routes', () => {
        expect(canAccessRoute('MANAGER', '/dashboard/admin')).toBe(false)
        expect(canAccessRoute('MANAGER', '/dashboard/admin/users')).toBe(false)
      })
    })

    describe('admin-level routes', () => {
      it('should allow admins to access all routes', () => {
        const adminRoutes = [
          '/dashboard/admin',
          '/dashboard/admin/users',
          '/dashboard/admin/operators',
          '/dashboard/admin/requests',
          '/dashboard/admin/settings',
          '/dashboard/admin/analytics'
        ]

        adminRoutes.forEach(route => {
          expect(canAccessRoute('ADMIN', route)).toBe(true)
        })
      })

      it('should allow admins to access all lower-level routes', () => {
        const allRoutes = [
          '/dashboard',
          '/dashboard/requests',
          '/dashboard/operator',
          '/dashboard/manager'
        ]

        allRoutes.forEach(route => {
          expect(canAccessRoute('ADMIN', route)).toBe(true)
        })
      })
    })
  })

  describe('ROLE_HIERARCHY constant', () => {
    it('should have correct hierarchy order', () => {
      expect(ROLE_HIERARCHY.USER).toBe(1)
      expect(ROLE_HIERARCHY.OPERATOR).toBe(2)
      expect(ROLE_HIERARCHY.MANAGER).toBe(3)
      expect(ROLE_HIERARCHY.ADMIN).toBe(4)
    })

    it('should have ascending values', () => {
      expect(ROLE_HIERARCHY.USER).toBeLessThan(ROLE_HIERARCHY.OPERATOR)
      expect(ROLE_HIERARCHY.OPERATOR).toBeLessThan(ROLE_HIERARCHY.MANAGER)
      expect(ROLE_HIERARCHY.MANAGER).toBeLessThan(ROLE_HIERARCHY.ADMIN)
    })
  })

  describe('hasHigherRole function', () => {
    it('should return true for higher roles', () => {
      expect(hasHigherRole('OPERATOR', 'USER')).toBe(true)
      expect(hasHigherRole('MANAGER', 'USER')).toBe(true)
      expect(hasHigherRole('MANAGER', 'OPERATOR')).toBe(true)
      expect(hasHigherRole('ADMIN', 'USER')).toBe(true)
      expect(hasHigherRole('ADMIN', 'OPERATOR')).toBe(true)
      expect(hasHigherRole('ADMIN', 'MANAGER')).toBe(true)
    })

    it('should return false for equal or lower roles', () => {
      expect(hasHigherRole('USER', 'USER')).toBe(false)
      expect(hasHigherRole('USER', 'OPERATOR')).toBe(false)
      expect(hasHigherRole('USER', 'MANAGER')).toBe(false)
      expect(hasHigherRole('USER', 'ADMIN')).toBe(false)
      
      expect(hasHigherRole('OPERATOR', 'OPERATOR')).toBe(false)
      expect(hasHigherRole('OPERATOR', 'MANAGER')).toBe(false)
      expect(hasHigherRole('OPERATOR', 'ADMIN')).toBe(false)
      
      expect(hasHigherRole('MANAGER', 'MANAGER')).toBe(false)
      expect(hasHigherRole('MANAGER', 'ADMIN')).toBe(false)
      
      expect(hasHigherRole('ADMIN', 'ADMIN')).toBe(false)
    })
  })

  describe('hasEqualOrHigherRole function', () => {
    it('should return true for equal roles', () => {
      expect(hasEqualOrHigherRole('USER', 'USER')).toBe(true)
      expect(hasEqualOrHigherRole('OPERATOR', 'OPERATOR')).toBe(true)
      expect(hasEqualOrHigherRole('MANAGER', 'MANAGER')).toBe(true)
      expect(hasEqualOrHigherRole('ADMIN', 'ADMIN')).toBe(true)
    })

    it('should return true for higher roles', () => {
      expect(hasEqualOrHigherRole('OPERATOR', 'USER')).toBe(true)
      expect(hasEqualOrHigherRole('MANAGER', 'USER')).toBe(true)
      expect(hasEqualOrHigherRole('MANAGER', 'OPERATOR')).toBe(true)
      expect(hasEqualOrHigherRole('ADMIN', 'USER')).toBe(true)
      expect(hasEqualOrHigherRole('ADMIN', 'OPERATOR')).toBe(true)
      expect(hasEqualOrHigherRole('ADMIN', 'MANAGER')).toBe(true)
    })

    it('should return false for lower roles', () => {
      expect(hasEqualOrHigherRole('USER', 'OPERATOR')).toBe(false)
      expect(hasEqualOrHigherRole('USER', 'MANAGER')).toBe(false)
      expect(hasEqualOrHigherRole('USER', 'ADMIN')).toBe(false)
      
      expect(hasEqualOrHigherRole('OPERATOR', 'MANAGER')).toBe(false)
      expect(hasEqualOrHigherRole('OPERATOR', 'ADMIN')).toBe(false)
      
      expect(hasEqualOrHigherRole('MANAGER', 'ADMIN')).toBe(false)
    })
  })

  describe('getLowerRoles function', () => {
    it('should return correct lower roles for each role', () => {
      expect(getLowerRoles('USER')).toEqual([])
      expect(getLowerRoles('OPERATOR')).toEqual(['USER'])
      expect(getLowerRoles('MANAGER')).toEqual(expect.arrayContaining(['USER', 'OPERATOR']))
      expect(getLowerRoles('ADMIN')).toEqual(expect.arrayContaining(['USER', 'OPERATOR', 'MANAGER']))
    })

    it('should return roles in correct order', () => {
      const managerLowerRoles = getLowerRoles('MANAGER')
      const adminLowerRoles = getLowerRoles('ADMIN')
      
      expect(managerLowerRoles).toHaveLength(2)
      expect(adminLowerRoles).toHaveLength(3)
      
      // Should contain all expected roles
      expect(adminLowerRoles).toContain('USER')
      expect(adminLowerRoles).toContain('OPERATOR')
      expect(adminLowerRoles).toContain('MANAGER')
    })
  })

  describe('canManageUser function', () => {
    it('should allow admins to manage everyone', () => {
      expect(canManageUser('ADMIN', 'USER')).toBe(true)
      expect(canManageUser('ADMIN', 'OPERATOR')).toBe(true)
      expect(canManageUser('ADMIN', 'MANAGER')).toBe(true)
      expect(canManageUser('ADMIN', 'ADMIN')).toBe(true)
    })

    it('should allow managers to manage users and operators', () => {
      expect(canManageUser('MANAGER', 'USER')).toBe(true)
      expect(canManageUser('MANAGER', 'OPERATOR')).toBe(true)
      expect(canManageUser('MANAGER', 'MANAGER')).toBe(false)
      expect(canManageUser('MANAGER', 'ADMIN')).toBe(false)
    })

    it('should not allow users and operators to manage others', () => {
      expect(canManageUser('USER', 'USER')).toBe(false)
      expect(canManageUser('USER', 'OPERATOR')).toBe(false)
      expect(canManageUser('USER', 'MANAGER')).toBe(false)
      expect(canManageUser('USER', 'ADMIN')).toBe(false)

      expect(canManageUser('OPERATOR', 'USER')).toBe(false)
      expect(canManageUser('OPERATOR', 'OPERATOR')).toBe(false)
      expect(canManageUser('OPERATOR', 'MANAGER')).toBe(false)
      expect(canManageUser('OPERATOR', 'ADMIN')).toBe(false)
    })
  })

  describe('getAvailableDashboardRoutes function', () => {
    it('should return base routes for all roles', () => {
      const roles: UserRole[] = ['USER', 'OPERATOR', 'MANAGER', 'ADMIN']
      
      roles.forEach(role => {
        const routes = getAvailableDashboardRoutes(role)
        
        // Should contain base routes
        expect(routes.some(route => route.href === '/dashboard')).toBe(true)
        expect(routes.some(route => route.href === '/dashboard/settings')).toBe(true)
        expect(routes.some(route => route.href === '/dashboard/billing')).toBe(true)
      })
    })

    it('should return only base routes for USER role', () => {
      const userRoutes = getAvailableDashboardRoutes('USER')
      
      expect(userRoutes).toHaveLength(3) // Only base routes
      expect(userRoutes.every(route => 
        route.href === '/dashboard' || 
        route.href === '/dashboard/settings' || 
        route.href === '/dashboard/billing'
      )).toBe(true)
    })

    it('should return operator-specific routes for OPERATOR role', () => {
      const operatorRoutes = getAvailableDashboardRoutes('OPERATOR')
      
      expect(operatorRoutes.length).toBeGreaterThan(3) // Base + operator routes
      expect(operatorRoutes.some(route => route.href === '/dashboard/operator/assignments')).toBe(true)
      expect(operatorRoutes.some(route => route.href === '/dashboard/operator/profile')).toBe(true)
    })

    it('should return manager-specific routes for MANAGER role', () => {
      const managerRoutes = getAvailableDashboardRoutes('MANAGER')
      
      expect(managerRoutes.some(route => route.href === '/dashboard/manager/requests')).toBe(true)
      expect(managerRoutes.some(route => route.href === '/dashboard/manager/assignments')).toBe(true)
      expect(managerRoutes.some(route => route.href === '/dashboard/manager/progress')).toBe(true)
    })

    it('should return admin-specific routes for ADMIN role', () => {
      const adminRoutes = getAvailableDashboardRoutes('ADMIN')
      
      expect(adminRoutes.some(route => route.href === '/dashboard/admin/users')).toBe(true)
      expect(adminRoutes.some(route => route.href === '/dashboard/admin/operators')).toBe(true)
      expect(adminRoutes.some(route => route.href === '/dashboard/admin/analytics')).toBe(true)
      expect(adminRoutes.some(route => route.href === '/dashboard/admin/settings')).toBe(true)
    })

    it('should return routes with proper structure', () => {
      const routes = getAvailableDashboardRoutes('ADMIN')
      
      routes.forEach(route => {
        expect(route).toHaveProperty('title')
        expect(route).toHaveProperty('href')
        expect(route).toHaveProperty('icon')
        expect(typeof route.title).toBe('string')
        expect(typeof route.href).toBe('string')
        expect(typeof route.icon).toBe('string')
        expect(route.title.length).toBeGreaterThan(0)
        expect(route.href.startsWith('/')).toBe(true)
      })
    })

    it('should have increasing route counts with higher roles', () => {
      const userRoutes = getAvailableDashboardRoutes('USER')
      const operatorRoutes = getAvailableDashboardRoutes('OPERATOR')
      const managerRoutes = getAvailableDashboardRoutes('MANAGER')
      const adminRoutes = getAvailableDashboardRoutes('ADMIN')

      expect(userRoutes.length).toBeLessThan(operatorRoutes.length)
      expect(operatorRoutes.length).toBeLessThan(managerRoutes.length)
      expect(managerRoutes.length).toBeLessThan(adminRoutes.length)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle undefined and null values gracefully', () => {
      expect(hasPermission(undefined as any, 'submit_requests')).toBe(false)
      expect(hasPermission('USER', undefined as any)).toBe(false)
      expect(canAccessRoute(undefined as any, '/dashboard')).toBe(false) // Invalid role should be false
      expect(getUserPermissions(null as any)).toEqual([])
    })

    it('should handle empty strings gracefully', () => {
      expect(hasPermission('' as any, 'submit_requests')).toBe(false)
      expect(hasPermission('USER', '' as any)).toBe(false)
      expect(canAccessRoute('' as any, '/dashboard')).toBe(false) // Invalid role should be false
    })

    it('should be case sensitive for roles and permissions', () => {
      expect(hasPermission('user' as any, 'submit_requests')).toBe(false)
      expect(hasPermission('USER', 'SUBMIT_REQUESTS' as any)).toBe(false)
    })
  })
})
