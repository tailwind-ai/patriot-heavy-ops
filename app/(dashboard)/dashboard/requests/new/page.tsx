import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ServiceRequestForm } from "@/components/service-request-form"

export const metadata = {
  title: "Create Service Request",
  description: "Create a new equipment service request.",
}

export default async function NewServiceRequestPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Service Request"
        text="Fill out the form below to request heavy equipment with an operator."
      />
      <div className="grid gap-10">
        <ServiceRequestForm user={{ id: user.id, name: user.name, email: user.email }} />
      </div>
    </DashboardShell>
  )
}
