"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type ServiceRequestCreateButtonProps = ButtonProps

export function ServiceRequestCreateButton({
  className,
  variant,
  ...props
}: ServiceRequestCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    try {
      // Navigate to the create service request page
      await router.push("/dashboard/requests/new")
    } catch {
      // Navigation error
      toast({
        title: "Navigation failed",
        description: "Unable to navigate to the create request page. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Keep loading state until component unmounts (navigation completes)
      // Don't set loading to false here as the component will unmount
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 size-4" />
      )}
      New Service Request
    </button>
  )
}
