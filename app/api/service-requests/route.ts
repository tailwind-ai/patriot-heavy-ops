import * as z from "zod"
import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import {
  serviceRequestSchema,
  calculateTotalHours,
} from "@/lib/validations/service-request"
import { getCurrentUserWithRole } from "@/lib/session"
import { hasPermission } from "@/lib/permissions"
import { authenticateRequest } from "@/lib/middleware/mobile-auth"

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
  return sessionUser
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Check permissions based on user role
    let serviceRequests

    if (hasPermission(user.role, "view_all_requests")) {
      // Managers and Admins can see all requests
      serviceRequests = await db.serviceRequest.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          equipmentCategory: true,
          jobSite: true,
          startDate: true,
          endDate: true,
          requestedDurationType: true,
          requestedDurationValue: true,
          estimatedCost: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              email: true,
              company: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else if (hasPermission(user.role, "view_assignments")) {
      // Operators can see requests they're assigned to + their own requests
      serviceRequests = await db.serviceRequest.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          equipmentCategory: true,
          jobSite: true,
          startDate: true,
          endDate: true,
          requestedDurationType: true,
          requestedDurationValue: true,
          estimatedCost: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          OR: [
            { userId: user.id }, // Their own requests
            {
              userAssignments: {
                some: {
                  operatorId: user.id,
                },
              },
            }, // Requests they're assigned to
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else if (hasPermission(user.role, "view_own_requests")) {
      // Regular users can only see their own requests
      serviceRequests = await db.serviceRequest.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          equipmentCategory: true,
          jobSite: true,
          startDate: true,
          endDate: true,
          requestedDurationType: true,
          requestedDurationValue: true,
          estimatedCost: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else {
      return new Response("Forbidden", { status: 403 })
    }

    return new Response(JSON.stringify(serviceRequests))
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

    // Check if user has permission to submit requests
    if (!hasPermission(user.role, "submit_requests")) {
      return new Response(
        "Forbidden: You don't have permission to submit service requests",
        { status: 403 }
      )
    }
    const json = await req.json()
    const body = serviceRequestSchema.parse(json)

    const totalHours = calculateTotalHours(
      body.requestedDurationType,
      body.requestedDurationValue
    )

    const serviceRequest = await db.serviceRequest.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        company: body.company ?? null,
        jobSite: body.jobSite,
        transport: body.transport,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        equipmentCategory: body.equipmentCategory,
        equipmentDetail: body.equipmentDetail,
        requestedDurationType: body.requestedDurationType,
        requestedDurationValue: body.requestedDurationValue,
        requestedTotalHours: totalHours,
        rateType: body.rateType,
        baseRate: body.baseRate,
        status: "SUBMITTED",
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    })

    return new Response(JSON.stringify(serviceRequest))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
