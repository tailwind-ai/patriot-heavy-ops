"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ServiceRequestOperationsProps {
  serviceRequest: { id: string; title: string }
}

export function ServiceRequestOperations({
  serviceRequest,
}: ServiceRequestOperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  async function deleteServiceRequest() {
    try {
      const response = await fetch(
        `/api/service-requests/${serviceRequest.id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        let errorMessage =
          "Your service request was not deleted. Please try again."

        if (response.status === 403) {
          errorMessage =
            "You are not authorized to delete this service request."
        } else if (response.status === 404) {
          errorMessage =
            "Service request not found. It may have already been deleted."
        } else if (response.status >= 500) {
          errorMessage = "A server error occurred. Please try again later."
        }

        toast({
          title: "Failed to delete service request",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      }

      return true
    } catch {
      // Delete service request error
      toast({
        title: "Network error",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="size-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={`/dashboard/requests/${serviceRequest.id}`}
              className="flex w-full"
            >
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/dashboard/requests/${serviceRequest.id}/edit`}
              className="flex w-full"
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this service request?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              service request &quot;{serviceRequest.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const deleted = await deleteServiceRequest()

                if (deleted) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  router.refresh()
                  toast({
                    description: "Service request deleted successfully.",
                  })
                } else {
                  setIsDeleteLoading(false)
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 size-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
