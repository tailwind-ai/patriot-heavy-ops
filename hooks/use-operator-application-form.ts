"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { operatorApplicationSchema } from "@/lib/validations/user"
import { ServiceFactory, type GeocodingAddress } from "@/lib/services"

type FormData = z.infer<typeof operatorApplicationSchema>

interface UseOperatorApplicationFormProps {
  user: Pick<User, "id" | "name">
}

export function useOperatorApplicationForm({ user }: UseOperatorApplicationFormProps) {
  const router = useRouter()
  const geocodingService = React.useMemo(() => ServiceFactory.getGeocodingService(), [])

  // Form state
  const form = useForm<FormData>({
    resolver: zodResolver(operatorApplicationSchema),
    defaultValues: {
      location: "",
    },
  })

  // Component state
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [inputValue, setInputValue] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<GeocodingAddress[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  // Debounced address search
  const searchAddresses = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const result = await geocodingService.searchAddresses(query)
      if (result.success && result.data) {
        setSuggestions(result.data)
      } else {
        setSuggestions([])
      }
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [geocodingService])

  // Handle input change with debouncing
  const handleInputChange = React.useCallback((value: string) => {
    setInputValue(value)
    form.setValue("location", value) // Update form value as user types

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
    setInputValue(formattedAddress)
    form.setValue("location", formattedAddress)
    setSuggestions([]) // Clear suggestions to hide dropdown
  }, [form])

  // Handle suggestions blur with delay for clicks
  const handleSuggestionsBlur = React.useCallback(() => {
    // Hide dropdown after a short delay to allow clicks on suggestions
    setTimeout(() => setSuggestions([]), 150)
  }, [])

  // Form submission handler
  const onSubmit = React.useCallback(async (data: FormData) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/users/${user.id}/operator-application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: data.location,
        }),
      })

      if (!response?.ok) {
        // TODO: Add notification callback support
      console.log("Notification:", {
          title: "Something went wrong.",
          description: "Your application was not submitted. Please try again.",
          variant: "destructive",
        })
        return
      }

      // TODO: Add notification callback support
      console.log("Notification:", {
        description: "Your operator application has been submitted for review.",
      })

      router.refresh()
      return
    } catch {
      // TODO: Add notification callback support
      console.log("Notification:", {
        title: "Network error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      })
      return
    } finally {
      setIsSaving(false)
    }
  }, [user.id, router])

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
    isLoading,
    
    // Location geocoding
    inputValue,
    suggestions,
    handleInputChange,
    handleAddressSelect,
    handleSuggestionsBlur,
  }
}
