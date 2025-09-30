"use client"

/**
 * StatusTransitionButton Component
 * 
 * Role-based action button for status transitions.
 * Shows only when user has permission to perform the transition.
 */

import * as React from "react"
import type { ServiceRequestStatus } from "@prisma/client"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

/**
 * Status transition button props
 */
export type StatusTransitionButtonProps = {
  toStatus: ServiceRequestStatus | string
  label: string
  description?: string
  hasPermission: boolean
  isLoading?: boolean
  onConfirm: (data: { reason?: string; notes?: string }) => Promise<void>
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

/**
 * StatusTransitionButton component - role-based action button
 */
export function StatusTransitionButton({
  toStatus,
  label,
  description,
  hasPermission,
  isLoading = false,
  onConfirm,
  variant = "default",
  className,
}: StatusTransitionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Don't render if user doesn't have permission
  if (!hasPermission) {
    return null
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      const confirmData: { reason?: string; notes?: string } = {}
      if (reason) {
        confirmData.reason = reason
      }
      if (notes) {
        confirmData.notes = notes
      }
      await onConfirm(confirmData)
      setIsOpen(false)
      setReason("")
      setNotes("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          disabled={isLoading || isSubmitting}
          className={className}
        >
          {(isLoading || isSubmitting) && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            {description || `Change status to ${toStatus}?`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for this change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Internal Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add internal notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
