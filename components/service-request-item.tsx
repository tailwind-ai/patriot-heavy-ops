import Link from "next/link"
import { ServiceRequest } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ServiceRequestOperations } from "@/components/service-request-operations"

interface ServiceRequestItemProps {
  serviceRequest: Pick<ServiceRequest, "id" | "title" | "status" | "equipmentCategory" | "jobSite" | "startDate" | "createdAt">
}

export function ServiceRequestItem({ serviceRequest }: ServiceRequestItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/requests/${serviceRequest.id}`}
          className="font-semibold hover:underline"
        >
          {serviceRequest.title}
        </Link>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span className="font-medium">Status:</span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(serviceRequest.status)}`}>
              {formatStatus(serviceRequest.status)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">Equipment:</span>
            <span>{formatEquipmentCategory(serviceRequest.equipmentCategory)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span className="font-medium">Location:</span>
            <span className="max-w-xs truncate">{serviceRequest.jobSite}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">Start:</span>
            <span>{formatDate(serviceRequest.startDate?.toDateString() || "")}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Created {formatDate(serviceRequest.createdAt?.toDateString() || "")}
        </p>
      </div>
      <ServiceRequestOperations serviceRequest={{ id: serviceRequest.id, title: serviceRequest.title }} />
    </div>
  )
}

ServiceRequestItem.Skeleton = function ServiceRequestItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800"
    case "UNDER_REVIEW":
      return "bg-yellow-100 text-yellow-800"
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "OPERATOR_ASSIGNED":
      return "bg-purple-100 text-purple-800"
    case "JOB_IN_PROGRESS":
      return "bg-indigo-100 text-indigo-800"
    case "JOB_COMPLETED":
      return "bg-green-100 text-green-800"
    case "CANCELLED":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function formatEquipmentCategory(category: string): string {
  switch (category) {
    case "SKID_STEERS_TRACK_LOADERS":
      return "Skid Steers & Track Loaders"
    case "FRONT_END_LOADERS":
      return "Front End Loaders"
    case "BACKHOES_EXCAVATORS":
      return "Backhoes & Excavators"
    case "BULLDOZERS":
      return "Bulldozers"
    case "GRADERS":
      return "Graders"
    case "DUMP_TRUCKS":
      return "Dump Trucks"
    case "WATER_TRUCKS":
      return "Water Trucks"
    case "SWEEPERS":
      return "Sweepers"
    case "TRENCHERS":
      return "Trenchers"
    default:
      return category.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }
}
