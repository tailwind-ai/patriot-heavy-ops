"use client"

/**
 * WorkflowHistory Component
 * 
 * Audit trail display showing all status changes with user and timestamp info.
 * Mobile-responsive layout with collapsible entries.
 */

import * as React from "react"
import type { ServiceRequestStatus } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, User, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"

/**
 * History entry type
 */
export type WorkflowHistoryEntry = {
  id: string
  fromStatus: ServiceRequestStatus | null
  toStatus: ServiceRequestStatus
  changedBy: string
  changedByUser?: {
    id: string
    name: string | null
    email: string | null
  }
  reason: string | null
  notes: string | null
  createdAt: Date | string
}

/**
 * Workflow history props
 */
export type WorkflowHistoryProps = {
  history: WorkflowHistoryEntry[]
  isLoading?: boolean
  className?: string
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Get status badge color
 */
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    SUBMITTED: "bg-blue-100 text-blue-800",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    OPERATOR_ASSIGNED: "bg-purple-100 text-purple-800",
    JOB_IN_PROGRESS: "bg-indigo-100 text-indigo-800",
    JOB_COMPLETED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  }
  return colorMap[status] || "bg-gray-100 text-gray-800"
}

/**
 * WorkflowHistory component - displays status change audit trail
 */
export function WorkflowHistory({
  history,
  isLoading = false,
  className,
}: WorkflowHistoryProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
          <CardDescription>Loading history...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
          <CardDescription>No status changes yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
        <CardDescription>
          Complete audit trail of all status changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="relative border-l-2 border-gray-200 pb-6 pl-6 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-2 top-0 size-4 rounded-full border-2 border-gray-200 bg-white" />

              {/* Entry content */}
              <div className="space-y-2">
                {/* Status badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {entry.fromStatus && (
                    <>
                      <Badge variant="outline" className={getStatusColor(entry.fromStatus)}>
                        {formatStatus(entry.fromStatus)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge className={getStatusColor(entry.toStatus)}>
                    {formatStatus(entry.toStatus)}
                  </Badge>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="size-3" />
                  <span>
                    {entry.changedByUser?.name || entry.changedByUser?.email || "Unknown User"}
                  </span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-3" />
                  <span>
                    {entry.createdAt
                      ? formatDate(
                          typeof entry.createdAt === "string"
                            ? entry.createdAt
                            : entry.createdAt.toISOString()
                        )
                      : "Unknown date"}
                  </span>
                </div>

                {/* Reason */}
                {entry.reason && (
                  <div className="text-sm">
                    <span className="font-medium">Reason: </span>
                    {entry.reason}
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <div className="mb-1 flex items-center gap-2 font-medium text-muted-foreground">
                      <FileText className="size-3" />
                      Internal Notes
                    </div>
                    <p className="text-foreground">{entry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

WorkflowHistory.Skeleton = function WorkflowHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
