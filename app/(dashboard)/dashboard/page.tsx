import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { ServiceRequestCreateButton } from "@/components/service-request-create-button"
import { ServiceRequestItem } from "@/components/service-request-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const serviceRequests = await db.serviceRequest.findMany({
    where: {
      requesterId: user.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      equipmentCategory: true,
      jobSite: true,
      startDate: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Service Requests" text="Create and manage your equipment service requests.">
        <ServiceRequestCreateButton />
      </DashboardHeader>
      <div>
        {serviceRequests?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {serviceRequests.map((serviceRequest) => (
              <ServiceRequestItem key={serviceRequest.id} serviceRequest={serviceRequest} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No service requests created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any service requests yet. Start by creating your first request.
            </EmptyPlaceholder.Description>
            <ServiceRequestCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
