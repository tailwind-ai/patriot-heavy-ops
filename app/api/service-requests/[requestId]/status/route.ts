/**
 * Workflow Status API Endpoint (Issue #223)
 * POST /api/service-requests/[id]/status - Change service request status
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"
import { ServiceFactory } from "@/lib/services"
import type { ChangeStatusInput } from "@/lib/services"
import { z } from "zod"

/**
 * Request body validation schema
 */
const statusChangeSchema = z.object({
  newStatus: z.string().min(1, "Status is required"),
  reason: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * POST /api/service-requests/[id]/status
 * Change service request status with workflow validation
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const params = await context.params
    
    // Authenticate user (supports both JWT and session)
    const authResult = await authenticateRequest(req)
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Parse and validate request body
    const body = await req.json()
    const validation = statusChangeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: validation.error.issues },
        { status: 422 }
      )
    }

    const { newStatus, reason, notes } = validation.data

    // Use service layer to change status
    const serviceRequestService = ServiceFactory.getServiceRequestService()
    
    const input: ChangeStatusInput = {
      requestId: params.requestId,
      newStatus,
      userId: user.id,
      userRole: (user.role as "USER" | "OPERATOR" | "MANAGER" | "ADMIN") || "USER",
      ...(reason && { reason }),
      ...(notes && { notes }),
    }

    const result = await serviceRequestService.changeStatus(input)

    if (!result.success) {
      // Handle specific error types
      if (result.error?.code === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Service request not found" },
          { status: 404 }
        )
      }

      if (result.error?.code === "INSUFFICIENT_PERMISSIONS") {
        return NextResponse.json(
          { error: result.error.message },
          { status: 403 }
        )
      }

      if (result.error?.code === "INVALID_TRANSITION") {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        )
      }

      if (result.error?.code === "BUSINESS_RULE_VIOLATION") {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        )
      }

      // Generic error
      return NextResponse.json(
        { error: "Failed to change status" },
        { status: 500 }
      )
    }

    // Return updated service request
    return NextResponse.json(result.data, { status: 200 })
  } catch (error) {
    console.error("Status change error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
