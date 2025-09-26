"use client"

import * as React from "react"
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

import { useServiceRequests } from "@/hooks/use-service-requests"

interface UserDashboardProps {
  onNavigateToCreateRequest?: () => void
}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ServiceRequestCreateButton } from "@/components/service-request-create-button"

/**
 * Status badge component with consistent styling
 */
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return { variant: "secondary" as const, label: "Under Review" }
      case "APPROVED":
        return { variant: "default" as const, label: "Approved" }
      case "OPERATOR_MATCHING":
      case "OPERATOR_ASSIGNED":
        return { variant: "default" as const, label: "In Progress" }
      case "JOB_IN_PROGRESS":
        return { variant: "default" as const, label: "Active" }
      case "JOB_COMPLETED":
      case "PAYMENT_RECEIVED":
      case "CLOSED":
        return { variant: "secondary" as const, label: "Completed" }
      case "REJECTED":
      case "CANCELLED":
        return { variant: "destructive" as const, label: "Cancelled" }
      default:
        return { variant: "outline" as const, label: status }
    }
  }

  const config = getStatusConfig(status)
  return <Badge variant={config.variant}>{config.label}</Badge>
}

/**
 * Stats card component for dashboard metrics
 */
interface StatsCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  className?: string
}

function StatsCard({ title, value, icon: Icon, description, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Service request item component
 */
interface ServiceRequestItemProps {
  request: {
    id: string
    title: string
    status: string
    equipmentCategory: string
    jobSite: string
    startDate: Date
    estimatedCost: number | null
    createdAt: Date
  }
}

function ServiceRequestItem({ request }: ServiceRequestItemProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "TBD"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col space-y-3 p-4 border-b last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate">{request.title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {request.equipmentCategory.replace(/_/g, " ")}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div className="truncate">
          <span className="font-medium">Location:</span> {request.jobSite}
        </div>
        <div>
          <span className="font-medium">Start:</span> {formatDate(request.startDate)}
        </div>
        <div>
          <span className="font-medium">Est. Cost:</span> {formatCurrency(request.estimatedCost)}
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for service requests
 */
function ServiceRequestSkeleton() {
  return (
    <div className="space-y-3 p-4 border-b">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

/**
 * UserDashboard Component
 * 
 * Provides service request tracking and creation for regular users.
 * Features mobile-first responsive design with touch-friendly interfaces.
 * 
 * Key Features:
 * - Service request statistics overview
 * - Recent service requests list
 * - Quick service request creation
 * - Mobile-optimized layout (320px to 4K)
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and error handling
 */
export function UserDashboard({ onNavigateToCreateRequest }: UserDashboardProps = {}) {
  const {
    serviceRequests,
    totalRequests,
    activeRequests,
    completedRequests,
    pendingApproval,
    isLoading,
    error,
    refetch,
  } = useServiceRequests({
    limit: 10,
    enableCaching: true,
  })

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your equipment service requests
            </p>
          </div>
          <ServiceRequestCreateButton />
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your equipment service requests
          </p>
        </div>
        <ServiceRequestCreateButton onClick={onNavigateToCreateRequest} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Requests"
              value={totalRequests}
              icon={TrendingUp}
              description="All time requests"
            />
            <StatsCard
              title="Active Requests"
              value={activeRequests}
              icon={Clock}
              description="Currently in progress"
            />
            <StatsCard
              title="Completed"
              value={completedRequests}
              icon={CheckCircle}
              description="Successfully finished"
            />
            <StatsCard
              title="Pending Approval"
              value={pendingApproval}
              icon={AlertCircle}
              description="Awaiting review"
            />
          </>
        )}
      </div>

      {/* Recent Service Requests */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Recent Service Requests</CardTitle>
            <CardDescription>
              Your latest equipment service requests
            </CardDescription>
          </div>
          {!isLoading && serviceRequests.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <ServiceRequestSkeleton key={i} />
              ))}
            </div>
          ) : serviceRequests.length > 0 ? (
            <div>
              {serviceRequests.map((request) => (
                <ServiceRequestItem key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="post" />
                <EmptyPlaceholder.Title>
                  No service requests yet
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Get started by creating your first equipment service request.
                </EmptyPlaceholder.Description>
                <ServiceRequestCreateButton variant="outline" onClick={onNavigateToCreateRequest} />
              </EmptyPlaceholder>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
