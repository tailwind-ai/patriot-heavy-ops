"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { serviceRequestSchema, calculateTotalHours } from "@/lib/validations/service-request"
import { ServiceFactory, type GeocodingAddress } from "@/lib/services"
import { NotificationCallbacks, createNoOpNotifications } from "@/lib/utils/notifications"

type FormData = z.infer<typeof serviceRequestSchema>

type UseServiceRequestFormProps = {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  notifications?: NotificationCallbacks
}

export function useServiceRequestForm({ user, notifications }: UseServiceRequestFormProps) {
  // Use provided notifications or fallback to no-op
  const notificationCallbacks = notifications || createNoOpNotifications()
  const router = useRouter()
  const geocodingService = ServiceFactory.getGeocodingService()

  // Form state
  const form = useForm<FormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      contactName: user.name || "",
      contactEmail: user.email || "",
      contactPhone: "",
      company: "",
      title: "",
      description: "",
      jobSite: "",
      transport: "WE_HANDLE_IT",
      startDate: "",
      endDate: "",
      equipmentCategory: "SKID_STEERS_TRACK_LOADERS",
      equipmentDetail: "",
      requestedDurationType: "FULL_DAY",
      requestedDurationValue: 1,
      requestedTotalHours: 8,
      rateType: "DAILY",
      baseRate: 500,
    },
  })

  // Component state
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [jobSiteInput, setJobSiteInput] = React.useState("")
  const [jobSiteSuggestions, setJobSiteSuggestions] = React.useState<GeocodingAddress[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = React.useState(false)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  const watchedDurationType = form.watch("requestedDurationType")
  const watchedDurationValue = form.watch("requestedDurationValue")

  // Update total hours when duration changes
  React.useEffect(() => {
    const totalHours = calculateTotalHours(watchedDurationType, watchedDurationValue)
    form.setValue("requestedTotalHours", totalHours)
  }, [watchedDurationType, watchedDurationValue, form])

  // Debounced address search using geocoding service
  const searchAddresses = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      setJobSiteSuggestions([])
      return
    }

    setIsLoadingAddresses(true)
    try {
      const result = await geocodingService.searchAddresses(query, {
        limit: 5,
        countryCode: "us",
      })
      
      if (result.success) {
        setJobSiteSuggestions(result.data || [])
      } else {
        // Service returned an error
        setJobSiteSuggestions([])
        notificationCallbacks.showError(
          result.error.message || "Unable to search for addresses at the moment. Please enter the address manually.",
          "Address search unavailable"
        )
      }
    } catch {
      // Unexpected error - fallback to manual entry
      setJobSiteSuggestions([])
      notificationCallbacks.showError(
        "Unable to search for addresses at the moment. Please enter the address manually.",
        "Address search unavailable"
      )
    } finally {
      setIsLoadingAddresses(false)
    }
  }, [geocodingService])

  // Handle job site input change with debouncing
  const handleJobSiteInputChange = React.useCallback((value: string) => {
    setJobSiteInput(value)
    form.setValue("jobSite", value)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      searchAddresses(value)
    }, 300)
  }, [form, searchAddresses])

  // Handle address selection
  const handleAddressSelect = React.useCallback((suggestion: GeocodingAddress) => {
    const formattedAddress = suggestion.displayName
    setJobSiteInput(formattedAddress)
    form.setValue("jobSite", formattedAddress)
    setJobSiteSuggestions([])
  }, [form])

  // Form submission handler
  const onSubmit = React.useCallback(async (data: FormData) => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let errorMessage = "Your service request was not created. Please try again."
        
        try {
          const errorData = await response.json()
          if (response?.status === 422) {
            // Validation errors
            errorMessage = "Please check your form data and try again."
            if (Array.isArray(errorData) && errorData.length > 0) {
              errorMessage = `Validation error: ${errorData[0].message}`
            }
          } else if (response?.status === 403) {
            errorMessage = "You are not authorized to create service requests. Please log in and try again."
          } else if (response?.status === 500) {
            errorMessage = "A server error occurred. Please try again later."
          } else if (errorData?.message) {
            errorMessage = errorData.message
          }
        } catch {
          // If we can't parse the error response, use status-based messages
          if (response?.status === 403) {
            errorMessage = "You are not authorized to create service requests. Please log in and try again."
          } else if (response?.status >= 500) {
            errorMessage = "A server error occurred. Please try again later."
          }
        }

        notificationCallbacks.showError(
          errorMessage,
          "Failed to create service request"
        )
        return
      }

      notificationCallbacks.showSuccess("Your service request has been created successfully.")

      // Navigate and refresh after successful creation
      router.push("/dashboard")
      router.refresh()
      return
    } catch {
      // Service request creation error - show user-friendly message
      notificationCallbacks.showError(
        "Unable to connect to the server. Please check your internet connection and try again.",
        "Network error"
      )
      return
    } finally {
      setIsSaving(false)
    }
  }, [router])

  // Cleanup debounce on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    // Form methods
    form,
    onSubmit,
    
    // Loading states
    isSaving,
    isLoadingAddresses,
    
    // Job site geocoding
    jobSiteInput,
    jobSiteSuggestions,
    handleJobSiteInputChange,
    handleAddressSelect,
  }
}
