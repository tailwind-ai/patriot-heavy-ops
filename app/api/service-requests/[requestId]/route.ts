import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { serviceRequestUpdateSchema } from "@/lib/validations/service-request"
import { getCurrentUserWithRole } from "@/lib/session"
import { hasPermission, canManageUser } from "@/lib/permissions"

const routeContextSchema = z.object({
  params: z.object({
    requestId: z.string(),
  }),
})

async function verifyCurrentUserHasAccessToRequest(requestId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }

  const count = await db.serviceRequest.count({
    where: {
      id: requestId,
      userId: session.user.id,
    },
  })

  return count > 0
}

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToRequest(params.requestId))) {
      return new Response(null, { status: 403 })
    }

    const serviceRequest = await db.serviceRequest.findUnique({
      where: {
        id: params.requestId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedManager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        userAssignments: {
          include: {
            operator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!serviceRequest) {
      return new Response(null, { status: 404 })
    }

    return new Response(JSON.stringify(serviceRequest))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToRequest(params.requestId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = serviceRequestUpdateSchema.parse(json)

    const serviceRequest = await db.serviceRequest.update({
      where: {
        id: params.requestId,
      },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.transport !== undefined && { transport: body.transport }),
        ...(body.startDate !== undefined && { startDate: new Date(body.startDate) }),
        ...(body.endDate !== undefined && { endDate: new Date(body.endDate) }),
        ...(body.equipmentCategory !== undefined && { equipmentCategory: body.equipmentCategory }),
        ...(body.equipmentDetail !== undefined && { equipmentDetail: body.equipmentDetail }),
        ...(body.internalNotes !== undefined && { internalNotes: body.internalNotes }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
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

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToRequest(params.requestId))) {
      return new Response(null, { status: 403 })
    }

    await db.serviceRequest.delete({
      where: {
        id: params.requestId,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
