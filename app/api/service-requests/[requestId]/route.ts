import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const params = await context.params
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response(null, { status: 403 })
    }

    // Use service layer to get service request
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.getServiceRequestById({
      requestId: params.requestId,
      userId: user.id,
    })

    if (!result.success) {
      if (result?.error?.code === "ACCESS_DENIED") {
        return new Response(null, { status: 403 })
      }
      if (result?.error?.code === "NOT_FOUND") {
        return new Response(null, { status: 404 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result?.data))
  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const params = await context.params
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()

    // Use service layer to update service request
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.updateServiceRequest(
      params.requestId,
      json,
      user.id
    )

    if (!result.success) {
      if (result?.error?.code === "ACCESS_DENIED") {
        return new Response(null, { status: 403 })
      }
      if (result?.error?.code === "VALIDATION_ERROR") {
        const issues = result?.error?.details?.issues || result?.error?.details
        return new Response(JSON.stringify(issues), { status: 422 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result?.data))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const params = await context.params
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response(null, { status: 403 })
    }

    // Use service layer to delete service request
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    const result = await serviceRequestService.deleteServiceRequest(
      params.requestId,
      user.id
    )

    if (!result.success) {
      if (result?.error?.code === "ACCESS_DENIED") {
        return new Response(null, { status: 403 })
      }
      return new Response(null, { status: 500 })
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
