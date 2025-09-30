"use client"

/**
 * StatusTimeline Component
 * 
 * Visual status progression display with mobile-responsive design.
 * Shows current status and available next steps in workflow.
 */

import * as React from "react"
import type { ServiceRequestStatus } from "@prisma/client"
import { Check, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Status timeline props
 */
export type StatusTimelineProps = {
  currentStatus: ServiceRequestStatus
  history?: Array<{
    status: ServiceRequestStatus
    timestamp: Date
  }>
  className?: string
}

/**
 * Status display configuration
 */
const STATUS_FLOW: Array<{
  status: ServiceRequestStatus
  label: string
  description: string
}> = [
  { status: "SUBMITTED", label: "Submitted", description: "Request received" },
  { status: "UNDER_REVIEW", label: "Under Review", description: "Being evaluated" },
  { status: "APPROVED", label: "Approved", description: "Request approved" },
  { status: "OPERATOR_MATCHING", label: "Finding Operator", description: "Matching with operator" },
  { status: "OPERATOR_ASSIGNED", label: "Operator Assigned", description: "Operator confirmed" },
  { status: "JOB_IN_PROGRESS", label: "In Progress", description: "Work underway" },
  { status: "JOB_COMPLETED", label: "Completed", description: "Work finished" },
  { status: "CLOSED", label: "Closed", description: "Request closed" },
]

/**
 * StatusTimeline component - displays service request workflow progression
 */
export function StatusTimeline({
  currentStatus,
  className,
}: StatusTimelineProps) {
  const currentIndex = STATUS_FLOW.findIndex(
    (step) => step.status === currentStatus
  )

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Status Timeline</h3>
      
      {/* Mobile: Vertical timeline, Desktop: Horizontal stepper */}
      <div className="relative">
        {/* Mobile layout (< 768px) */}
        <div className="space-y-4 md:hidden">
          {STATUS_FLOW.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isPending = index > currentIndex

            return (
              <div
                key={step.status}
                className="flex items-start gap-3"
              >
                {/* Status icon */}
                <div className="relative shrink-0">
                  {isCompleted && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white">
                      <Check className="size-4" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Clock className="size-4" />
                    </div>
                  )}
                  {isPending && (
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <Circle className="size-4 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Connector line */}
                  {index < STATUS_FLOW.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-4 top-8 h-8 w-0.5",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>

                {/* Status content */}
                <div className="flex-1 pb-4">
                  <p
                    className={cn(
                      "font-medium",
                      isCurrent && "text-blue-600",
                      isPending && "text-gray-500"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop layout (>= 768px) */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {STATUS_FLOW.map((step, index) => {
              const isCompleted = index < currentIndex
              const isCurrent = index === currentIndex
              const isPending = index > currentIndex

              return (
                <React.Fragment key={step.status}>
                  <div className="flex flex-col items-center">
                    {/* Status icon */}
                    {isCompleted && (
                      <div className="flex size-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check className="size-5" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white ring-4 ring-blue-100">
                        <Clock className="size-5" />
                      </div>
                    )}
                    {isPending && (
                      <div className="flex size-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                        <Circle className="size-5 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Label */}
                    <div className="mt-2 text-center">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isCurrent && "text-blue-600",
                          isPending && "text-gray-500"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < STATUS_FLOW.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 flex-1",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
