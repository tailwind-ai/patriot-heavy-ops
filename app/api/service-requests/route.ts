import * as z from "zod"
import { NextRequest } from "next/server"
import { getCurrentUserWithRole } from "@/lib/session"
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
  const sessionUser = await getCurrentUserWithRole()
  if (!sessionUser) return null

  return {
    id: sessionUser.id,
    email: sessionUser.email || "",
    role: sessionUser.role,
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Use service layer to get service requests
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.getServiceRequests({
      userId: user.id,
      userRole: user.role,
    })

    if (!result.success) {
      if (result.error.code === "INSUFFICIENT_PERMISSIONS") {
        return new Response("Forbidden", { status: 403 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result.data))
  } catch {
    // Error fetching service requests
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const json = await req.json()

    // Use service layer to create service request
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.createServiceRequest(
      {
        ...json,
        userId: user.id,
      },
      user.role
    )

    if (!result.success) {
      if (result.error.code === "INSUFFICIENT_PERMISSIONS") {
        return new Response(
          "Forbidden: You don't have permission to submit service requests",
          { status: 403 }
        )
      }
      if (result.error.code === "VALIDATION_ERROR") {
        const issues = result.error.details?.issues || result.error.details
        return new Response(JSON.stringify(issues), { status: 422 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result.data))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
