"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { operatorApplicationSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface OperatorApplicationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">
}

type FormData = z.infer<typeof operatorApplicationSchema>

interface AddressSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: string
}

export function OperatorApplicationForm({
  user,
  className,
  ...props
}: OperatorApplicationFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(operatorApplicationSchema),
    defaultValues: {
      location: "",
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [inputValue, setInputValue] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const debounceRef = React.useRef<NodeJS.Timeout>()

  // const selectedLocation = watch("location")

  // Debounced address search
  const searchAddresses = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const url = `/api/geocoding?q=${encodeURIComponent(query)}`

      const response = await fetch(url)
      const data = await response.json()

      setSuggestions(data || [])
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(value)
    }, 300)
  }

  // Handle address selection
  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const formattedAddress = suggestion.display_name
    setInputValue(formattedAddress)
    setValue("location", formattedAddress)
    setSuggestions([]) // Clear suggestions to hide dropdown
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}/operator-application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: data.location,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your application was not submitted. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your operator application has been submitted for review.",
    })

    router.refresh()
    return
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Apply to Become an Operator</CardTitle>
          <CardDescription>
            Are you a heavy equipment operator? Enter your service area so we
            can show job requests near you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label htmlFor="location">Service Area</Label>
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => {
                  // Hide dropdown after a short delay to allow clicks on suggestions
                  setTimeout(() => setSuggestions([]), 150)
                }}
                placeholder="Enter city, state, or address..."
                className="w-[400px]"
              />
              {isLoading && (
                <Icons.spinner className="absolute right-3 top-3 size-4 animate-spin" />
              )}
              {suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-[400px] overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleAddressSelect(suggestion)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          handleAddressSelect(suggestion)
                        }
                      }}
                      className="cursor-pointer border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium">
                        {suggestion.display_name.split(",")[0]}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {suggestion.display_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors?.location && (
              <p className="px-1 text-xs text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            <span>Apply Now</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
