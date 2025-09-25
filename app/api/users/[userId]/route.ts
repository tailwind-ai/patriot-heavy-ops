import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"

/**
 * Helper function to get authenticated user from either JWT or session
 */
async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | null> {
  // Try mobile auth first, fallback to session auth
  const authResult = await authenticateRequest(req)

  if (authResult.isAuthenticated && authResult.user) {
    return {
      id: authResult.user.id,
      email: authResult.user.email,
      role: authResult.user.role || "USER",
    }
  }

  // Fallback to session-based auth for backward compatibility
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return {
    id: session.user.id,
    email: session.user.email || "",
    role: session.user.role || "USER",
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Validate the route context.
    const params = await context.params
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response(null, { status: 403 })
    }

    // Get the request body
    const body = await req.json()

    // Use service layer to update user profile
    const authService = ServiceFactory.getAuthService()
    const result = await authService.updateUserProfile(
      params.userId,
      user.id,
      body
    )

    if (!result.success) {
      if (result.error?.code === "ACCESS_DENIED") {
        return new Response(null, { status: 403 })
      }
      if (result.error?.code === "VALIDATION_ERROR") {
        // Extract issues from the details object to match expected format
        // Ensure details.issues is always present and is an array
        const details = result.error.details || {}
        let issues: unknown[] = []
        
        if (Array.isArray(details.issues)) {
          issues = details.issues
        } else if (Array.isArray(details)) {
          issues = details
        }
        return new Response(JSON.stringify(issues), { status: 422 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
