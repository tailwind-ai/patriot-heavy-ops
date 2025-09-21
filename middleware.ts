import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // If no token, redirect to login (handled by withAuth)
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const userRole = token.role as string

    // Define role-based route access
    const roleRoutes = {
      // Operator-specific routes
      '/dashboard/operator': ['OPERATOR', 'MANAGER', 'ADMIN'],
      
      // Manager-specific routes  
      '/dashboard/manager': ['MANAGER', 'ADMIN'],
      
      // Admin-specific routes
      '/dashboard/admin': ['ADMIN']
    }

    // Check if the current path requires specific role access
    for (const [routePattern, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(routePattern)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard based on role
          const redirectPath = getRoleBasedRedirect(userRole)
          return NextResponse.redirect(new URL(redirectPath, req.url))
        }
        break
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin'
    case 'MANAGER':
      return '/dashboard/manager'
    case 'OPERATOR':
      return '/dashboard/operator'
    case 'USER':
    default:
      return '/dashboard'
  }
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    // Protect all dashboard routes
    '/dashboard/:path*',
    // Protect API routes that need authentication
    '/api/service-requests/:path*',
    '/api/users/:path*'
  ]
}
