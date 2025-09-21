import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { serviceRequestSchema, calculateTotalHours } from "@/lib/validations/service-request"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const serviceRequests = await db.serviceRequest.findMany({
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
        requesterId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return new Response(JSON.stringify(serviceRequests))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const json = await req.json()
    const body = serviceRequestSchema.parse(json)

    const totalHours = calculateTotalHours(body.requestedDurationType, body.requestedDurationValue)

    const serviceRequest = await db.serviceRequest.create({
      data: {
        title: body.title,
        description: body.description,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        company: body.company,
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
        requesterId: user.id,
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
