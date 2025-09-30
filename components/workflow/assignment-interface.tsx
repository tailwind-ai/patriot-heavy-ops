"use client"

/**
 * AssignmentInterface Component
 * 
 * Operator assignment UI with operator selection and rate/hours input.
 * Mobile-first responsive design.
 */

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus } from "lucide-react"

/**
 * Available operator type
 */
export type AvailableOperator = {
  id: string
  name: string | null
  email: string | null
}

/**
 * Assignment interface props
 */
export type AssignmentInterfaceProps = {
  availableOperators: AvailableOperator[]
  isLoading?: boolean
  onAssign: (data: {
    operatorId: string
    rate?: number
    estimatedHours?: number
  }) => Promise<void>
  hasPermission: boolean
  className?: string
}

/**
 * AssignmentInterface component - operator assignment UI
 */
export function AssignmentInterface({
  availableOperators,
  isLoading = false,
  onAssign,
  hasPermission,
  className,
}: AssignmentInterfaceProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedOperatorId, setSelectedOperatorId] = React.useState<string>("")
  const [rate, setRate] = React.useState<string>("")
  const [estimatedHours, setEstimatedHours] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Don't render if user doesn't have permission
  if (!hasPermission) {
    return null
  }

  const handleAssign = async () => {
    if (!selectedOperatorId) {
      return
    }

    setIsSubmitting(true)
    try {
      const assignData: {
        operatorId: string
        rate?: number
        estimatedHours?: number
      } = {
        operatorId: selectedOperatorId,
      }
      
      if (rate) {
        assignData.rate = parseFloat(rate)
      }
      if (estimatedHours) {
        assignData.estimatedHours = parseFloat(estimatedHours)
      }
      
      await onAssign(assignData)
      setIsOpen(false)
      setSelectedOperatorId("")
      setRate("")
      setEstimatedHours("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setSelectedOperatorId("")
    setRate("")
    setEstimatedHours("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={isLoading || availableOperators.length === 0}
          className={className}
        >
          <UserPlus className="mr-2 size-4" />
          Assign Operator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Operator</DialogTitle>
          <DialogDescription>
            Select an operator and set assignment details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Operator selection */}
          <div className="grid gap-2">
            <Label htmlFor="operator">Operator *</Label>
            <Select
              value={selectedOperatorId}
              onValueChange={setSelectedOperatorId}
              disabled={isSubmitting}
            >
              <SelectTrigger id="operator">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map((operator) => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name || operator.email || `Operator ${operator.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableOperators.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No operators available
              </p>
            )}
          </div>

          {/* Rate input */}
          <div className="grid gap-2">
            <Label htmlFor="rate">Hourly Rate (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                disabled={isSubmitting}
                className="pl-7"
              />
            </div>
          </div>

          {/* Estimated hours input */}
          <div className="grid gap-2">
            <Label htmlFor="estimatedHours">Estimated Hours (optional)</Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting || !selectedOperatorId}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
