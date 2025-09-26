"use client"

import * as React from "react"
import { Wrench, Clock, CheckCircle, MapPin, Calendar, DollarSign, AlertCircle } from "lucide-react"

import { useOperatorJobs } from "@/hooks/use-operator-jobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
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

/**
 * Stats card component for operator metrics
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
 * Available job item component with accept action
 */
interface AvailableJobItemProps {
  job: {
    id: string
    title: string
    status: string
    equipmentCategory: string
    jobSite: string
    startDate: Date
    endDate: Date | null
    estimatedCost: number | null
    user?: {
      name: string | null
      company: string | null
    }
  }
  onAccept: (jobId: string) => Promise<void>
  isAccepting: boolean
}

function AvailableJobItem({ job, onAccept, isAccepting }: AvailableJobItemProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

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

  const handleAccept = async () => {
    await onAccept(job.id)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4 border-b p-4 last:border-b-0">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{job.title}</h3>
          <p className="text-xs text-muted-foreground">
            {job.equipmentCategory.replace(/_/g, " ")}
          </p>
          {job.user && (
            <p className="text-xs text-muted-foreground">
              Client: {job.user.name || "Unknown"} 
              {job.user.company && ` (${job.user.company})`}
            </p>
          )}
        </div>
        <Badge variant="outline">Available</Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center space-x-1">
          <MapPin className="size-3" />
          <span className="truncate">{job.jobSite}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="size-3" />
          <span>Start: {formatDate(job.startDate)}</span>
        </div>
        {job.endDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="size-3" />
            <span>End: {formatDate(job.endDate)}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <DollarSign className="size-3" />
          <span>Est: {formatCurrency(job.estimatedCost)}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              className="touch-target w-full sm:w-auto"
              disabled={isAccepting}
            >
              {isAccepting ? "Accepting..." : "Accept Job"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept Job Assignment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to accept this job? You will be responsible for completing the work as specified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAccept} disabled={isAccepting}>
                {isAccepting ? "Accepting..." : "Accept Job"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

/**
 * Active assignment item component with complete action
 */
interface ActiveAssignmentItemProps {
  assignment: {
    id: string
    status: string
    serviceRequest: {
      title: string
      jobSite: string
      startDate: Date
      endDate: Date | null
      status: string
    }
  }
  onComplete: (assignmentId: string) => Promise<void>
  isCompleting: boolean
}

function ActiveAssignmentItem({ assignment, onComplete, isCompleting }: ActiveAssignmentItemProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "JOB_IN_PROGRESS":
        return <Badge variant="default">In Progress</Badge>
      case "JOB_SCHEDULED":
        return <Badge variant="secondary">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status.replace(/_/g, " ")}</Badge>
    }
  }

  const canComplete = assignment.serviceRequest.status === "JOB_IN_PROGRESS"

  const handleComplete = async () => {
    await onComplete(assignment.id)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4 border-b p-4 last:border-b-0">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{assignment.serviceRequest.title}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {assignment.serviceRequest.jobSite}
          </p>
        </div>
        {getStatusBadge(assignment.serviceRequest.status)}
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center space-x-1">
          <Calendar className="size-3" />
          <span>Start: {formatDate(assignment.serviceRequest.startDate)}</span>
        </div>
        {assignment.serviceRequest.endDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="size-3" />
            <span>End: {formatDate(assignment.serviceRequest.endDate)}</span>
          </div>
        )}
      </div>

      {canComplete && (
        <div className="flex justify-end">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="touch-target w-full sm:w-auto"
                disabled={isCompleting}
              >
                {isCompleting ? "Completing..." : "Mark Complete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Complete Job</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark this job as complete? This action will notify the client and manager.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleComplete} disabled={isCompleting}>
                  {isCompleting ? "Completing..." : "Mark Complete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}

/**
 * Loading skeleton for jobs/assignments
 */
function JobSkeleton() {
  return (
    <div className="space-y-4 border-b p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

/**
 * OperatorDashboard Component
 * 
 * Provides job management interface for operators.
 * Features mobile-first responsive design with touch-friendly interfaces.
 * 
 * Key Features:
 * - Available jobs with accept functionality
 * - Active assignments with completion tracking
 * - Operator-specific statistics
 * - Mobile-optimized layout with large touch targets
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and error handling
 */
export function OperatorDashboard() {
  const {
    availableJobs,
    activeAssignments,
    totalAssignments,
    activeJobs,
    completedJobs,
    isLoading,
    error,
    refetch,
    acceptJob,
    completeJob,
  } = useOperatorJobs({
    limit: 15,
    enableCaching: true,
  })

  const [acceptingJobId, setAcceptingJobId] = React.useState<string | null>(null)
  const [completingAssignmentId, setCompletingAssignmentId] = React.useState<string | null>(null)

  const handleAcceptJob = async (jobId: string) => {
    setAcceptingJobId(jobId)
    try {
      await acceptJob(jobId)
    } finally {
      setAcceptingJobId(null)
    }
  }

  const handleCompleteJob = async (assignmentId: string) => {
    setCompletingAssignmentId(assignmentId)
    try {
      await completeJob(assignmentId)
    } finally {
      setCompletingAssignmentId(null)
    }
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job assignments and available work
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
          <h1 className="text-2xl font-bold tracking-tight">Operator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job assignments and available work
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
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
              title="Total Assignments"
              value={totalAssignments}
              icon={Wrench}
              description="All time assignments"
            />
            <StatsCard
              title="Active Jobs"
              value={activeJobs}
              icon={Clock}
              description="Currently working"
            />
            <StatsCard
              title="Completed Jobs"
              value={completedJobs}
              icon={CheckCircle}
              description="Successfully finished"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Available Jobs</CardTitle>
            <CardDescription>
              New job opportunities you can accept
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div>
                {Array.from({ length: 2 }).map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            ) : availableJobs.length > 0 ? (
              <div>
                {availableJobs.map((job) => (
                  <AvailableJobItem
                    key={job.id}
                    job={job}
                    onAccept={handleAcceptJob}
                    isAccepting={acceptingJobId === job.id}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6">
                <EmptyPlaceholder>
                  <EmptyPlaceholder.Icon name="post" />
                  <EmptyPlaceholder.Title>
                    No available jobs
                  </EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    Check back later for new job opportunities.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
            <CardDescription>
              Your current job assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div>
                {Array.from({ length: 2 }).map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            ) : activeAssignments.length > 0 ? (
              <div>
                {activeAssignments.map((assignment) => (
                  <ActiveAssignmentItem
                    key={assignment.id}
                    assignment={assignment}
                    onComplete={handleCompleteJob}
                    isCompleting={completingAssignmentId === assignment.id}
                  />
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
                    Accept available jobs to see them here.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
