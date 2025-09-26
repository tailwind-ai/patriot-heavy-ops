"use client"

import * as React from "react"
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  BarChart3,
  Activity,
} from "lucide-react"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Stats card component for admin metrics
 */
interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  className?: string
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
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
 * Service request overview item for admin view
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
    createdAt: Date
    user?: {
      name: string | null
      email: string | null
      company: string | null
    }
    assignedOperators?: Array<{
      id: string
      name: string | null
      email: string | null
    }>
  }
}

function ServiceRequestOverviewItem({
  request,
}: ServiceRequestOverviewItemProps) {
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
    <div className="flex flex-col space-y-3 border-b p-4 last:border-b-0">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{request.title}</h3>
          <p className="text-xs text-muted-foreground">
            {request.equipmentCategory.replace(/_/g, " ")}
          </p>
          {request.user && (
            <p className="text-xs text-muted-foreground">
              Client: {request.user.name || "Unknown"} ({request.user.email})
              {request.user.company && ` - ${request.user.company}`}
            </p>
          )}
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
        <div className="truncate">
          <span className="font-medium">Location:</span> {request.jobSite}
        </div>
        <div>
          <span className="font-medium">Start:</span>{" "}
          {formatDate(request.startDate)}
        </div>
        <div>
          <span className="font-medium">Est. Cost:</span>{" "}
          {formatCurrency(request.estimatedCost)}
        </div>
        <div>
          <span className="font-medium">Created:</span>{" "}
          {formatDate(request.createdAt)}
        </div>
      </div>

      {request.assignedOperators && request.assignedOperators.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Assigned Operators:</span>{" "}
          {request.assignedOperators
            .map((op) => `${op.name || "Unknown"} (${op.email})`)
            .join(", ")}
        </div>
      )}
    </div>
  )
}

/**
 * User overview item for admin user management
 */
interface UserOverviewItemProps {
  user: {
    id: string
    name: string | null
    email: string | null
    role: string
    company: string | null
    createdAt: Date
  }
}

function UserOverviewItem({ user }: UserOverviewItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>
      case "MANAGER":
        return <Badge variant="default">Manager</Badge>
      case "OPERATOR":
        return <Badge variant="secondary">Operator</Badge>
      case "USER":
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="flex flex-col space-y-3 border-b p-4 last:border-b-0">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{user.name || "Unknown User"}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {user.company && (
            <p className="text-xs text-muted-foreground">
              Company: {user.company}
            </p>
          )}
        </div>
        {getRoleBadge(user.role)}
      </div>

      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Joined:</span>{" "}
        {formatDate(user.createdAt)}
      </div>
    </div>
  )
}

/**
 * Loading skeleton for items
 */
function ItemSkeleton() {
  return (
    <div className="space-y-3 border-b p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

/**
 * AdminDashboard Component
 *
 * Provides comprehensive system metrics and user management for administrators.
 * Features mobile-first responsive design with complete system oversight.
 *
 * Key Features:
 * - Complete system statistics with revenue and performance metrics
 * - All service requests with full details
 * - User management and activity overview
 * - Advanced analytics and reporting
 * - Mobile-optimized layout with comprehensive data
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and error handling
 */
export function AdminDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardData({
    role: "ADMIN",
    limit: 25,
    enableCaching: true,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatHours = (hours: number | undefined) => {
    if (!hours) return "N/A"
    return `${hours.toFixed(1)}h`
  }

  // Extract data
  const stats = dashboardData?.stats || {
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    pendingApproval: 0,
    revenue: 0,
    averageJobDuration: 0,
  }

  const allRequests = dashboardData?.recentRequests || []
  const users = dashboardData?.users || []
  const assignments = dashboardData?.assignments || []

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Complete system oversight and user management
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Complete system oversight and user management
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Requests"
              value={stats.totalRequests}
              icon={TrendingUp}
              description="All time requests"
            />
            <StatsCard
              title="Active Requests"
              value={stats.activeRequests}
              icon={Clock}
              description="Currently in progress"
            />
            <StatsCard
              title="Completed"
              value={stats.completedRequests}
              icon={CheckCircle}
              description="Successfully finished"
            />
            <StatsCard
              title="Pending Approval"
              value={stats.pendingApproval}
              icon={AlertCircle}
              description="Awaiting review"
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.revenue || 0)}
              icon={DollarSign}
              description="System revenue"
            />
            <StatsCard
              title="Avg Job Duration"
              value={formatHours(stats.averageJobDuration)}
              icon={BarChart3}
              description="Average completion time"
            />
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <Activity className="size-4" />
            <span>All Requests</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="size-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="flex items-center space-x-2"
          >
            <CheckCircle className="size-4" />
            <span>Assignments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>All Service Requests</CardTitle>
              <CardDescription>
                Complete system overview of all service requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ItemSkeleton key={i} />
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                Recent user registrations and account management
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ItemSkeleton key={i} />
                  ))}
                </div>
              ) : users.length > 0 ? (
                <div>
                  {users.map((user) => (
                    <UserOverviewItem key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="user" />
                    <EmptyPlaceholder.Title>
                      No users found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      No users have registered yet.
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>
                Current operator assignments across the system
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ItemSkeleton key={i} />
                  ))}
                </div>
              ) : assignments.length > 0 ? (
                <div>
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex flex-col space-y-3 border-b p-4 last:border-b-0"
                    >
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium">
                            {assignment.serviceRequest.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Location: {assignment.serviceRequest.jobSite}
                          </p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Assigned:</span>{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(assignment.assignedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="post" />
                    <EmptyPlaceholder.Title>
                      No active assignments
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      No operators are currently assigned to jobs.
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
