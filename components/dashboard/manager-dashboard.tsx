"use client"

import * as React from "react"
import { TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Users } from "lucide-react"

import { useManagerQueue } from "@/hooks/use-manager-queue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

/**
 * Stats card component for manager metrics
 */
interface StatsCardProps {
  title: string
  value: number | string
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
 * Pending approval item component with approve/reject actions
 */
interface PendingApprovalItemProps {
  request: {
    id: string
    title: string
    status: string
    equipmentCategory: string
    jobSite: string
    startDate: Date
    estimatedCost: number | null
    createdAt: Date
    user?: {
      name: string | null
      email: string | null
      company: string | null
    }
  }
  onApprove: (requestId: string) => Promise<void>
  onReject: (requestId: string, reason?: string) => Promise<void>
  isProcessing: boolean
}

function PendingApprovalItem({ request, onApprove, onReject, isProcessing }: PendingApprovalItemProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = React.useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState("")

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

  const handleApprove = async () => {
    await onApprove(request.id)
    setIsApproveDialogOpen(false)
  }

  const handleReject = async () => {
    await onReject(request.id, rejectReason.trim() || undefined)
    setIsRejectDialogOpen(false)
    setRejectReason("")
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border-b last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">{request.title}</h3>
          <p className="text-xs text-muted-foreground">
            {request.equipmentCategory.replace(/_/g, " ")}
          </p>
          {request.user && (
            <p className="text-xs text-muted-foreground">
              Client: {request.user.name || "Unknown"}
              {request.user.company && ` (${request.user.company})`}
            </p>
          )}
        </div>
        <Badge variant="secondary">Pending Review</Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
        <div className="truncate">
          <span className="font-medium">Location:</span> {request.jobSite}
        </div>
        <div>
          <span className="font-medium">Start:</span> {formatDate(request.startDate)}
        </div>
        <div>
          <span className="font-medium">Est. Cost:</span> {formatCurrency(request.estimatedCost)}
        </div>
        <div>
          <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              className="w-full sm:w-auto touch-target"
              disabled={isProcessing}
            >
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Service Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this service request? This will move it to operator matching.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove} disabled={isProcessing}>
                {isProcessing ? "Approving..." : "Approve"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full sm:w-auto touch-target"
              disabled={isProcessing}
            >
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Service Request</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this service request. This will be sent to the client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reject-reason">Reason for rejection</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleReject} 
                disabled={isProcessing}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isProcessing ? "Rejecting..." : "Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

/**
 * Service request overview item for all requests tab
 */
interface ServiceRequestOverviewItemProps {
  request: {
    id: string
    title: string
    status: string
    equipmentCategory: string
    jobSite: string
    startDate: Date
    estimatedCost: number | null
    user?: {
      name: string | null
      company: string | null
    }
    assignedOperators?: Array<{
      id: string
      name: string | null
    }>
  }
}

function ServiceRequestOverviewItem({ request }: ServiceRequestOverviewItemProps) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return <Badge variant="secondary">Under Review</Badge>
      case "APPROVED":
        return <Badge variant="default">Approved</Badge>
      case "OPERATOR_ASSIGNED":
        return <Badge variant="default">Assigned</Badge>
      case "JOB_IN_PROGRESS":
        return <Badge variant="default">In Progress</Badge>
      case "JOB_COMPLETED":
        return <Badge variant="secondary">Completed</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status.replace(/_/g, " ")}</Badge>
    }
  }

  return (
    <div className="flex flex-col space-y-3 p-4 border-b last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">{request.title}</h3>
          <p className="text-xs text-muted-foreground">
            {request.equipmentCategory.replace(/_/g, " ")}
          </p>
          {request.user && (
            <p className="text-xs text-muted-foreground">
              Client: {request.user.name || "Unknown"}
              {request.user.company && ` (${request.user.company})`}
            </p>
          )}
        </div>
        {getStatusBadge(request.status)}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
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

      {request.assignedOperators && request.assignedOperators.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Assigned Operators:</span>{" "}
          {request.assignedOperators.map(op => op.name || "Unknown").join(", ")}
        </div>
      )}
    </div>
  )
}

/**
 * Loading skeleton for requests
 */
function RequestSkeleton() {
  return (
    <div className="space-y-3 p-4 border-b">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

/**
 * ManagerDashboard Component
 * 
 * Provides approval queue management and oversight tools for managers.
 * Features mobile-first responsive design with comprehensive system metrics.
 * 
 * Key Features:
 * - Pending approval queue with approve/reject actions
 * - System-wide service request overview
 * - Revenue and performance metrics
 * - Mobile-optimized layout with large touch targets
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and error handling
 */
export function ManagerDashboard() {
  const {
    pendingApprovals,
    allRequests,
    totalRequests,
    activeRequests,
    completedRequests,
    pendingApproval,
    revenue,
    isLoading,
    error,
    refetch,
    approveRequest,
    rejectRequest,
  } = useManagerQueue({
    limit: 20,
    enableCaching: true,
  })

  const [processingRequestId, setProcessingRequestId] = React.useState<string | null>(null)

  const handleApproveRequest = async (requestId: string) => {
    setProcessingRequestId(requestId)
    try {
      await approveRequest(requestId)
    } finally {
      setProcessingRequestId(null)
    }
  }

  const handleRejectRequest = async (requestId: string, reason?: string) => {
    setProcessingRequestId(requestId)
    try {
      await rejectRequest(requestId, reason)
    } finally {
      setProcessingRequestId(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Manage approvals and oversee system operations
          </p>
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
          <h1 className="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Manage approvals and oversee system operations
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
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
              description="Awaiting your review"
            />
            <StatsCard
              title="Revenue"
              value={formatCurrency(revenue)}
              icon={DollarSign}
              description="Total revenue"
            />
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="approvals" className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Pending Approvals</span>
            {!isLoading && pendingApproval > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {pendingApproval}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>All Requests</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Service requests awaiting your approval
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <RequestSkeleton key={i} />
                  ))}
                </div>
              ) : pendingApprovals.length > 0 ? (
                <div>
                  {pendingApprovals.map((request) => (
                    <PendingApprovalItem
                      key={request.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                      isProcessing={processingRequestId === request.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="check" />
                    <EmptyPlaceholder.Title>
                      No pending approvals
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      All service requests have been reviewed.
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>All Service Requests</CardTitle>
              <CardDescription>
                Complete overview of system requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <RequestSkeleton key={i} />
                  ))}
                </div>
              ) : allRequests.length > 0 ? (
                <div>
                  {allRequests.map((request) => (
                    <ServiceRequestOverviewItem
                      key={request.id}
                      request={request}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="post" />
                    <EmptyPlaceholder.Title>
                      No service requests
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      No service requests have been submitted yet.
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
