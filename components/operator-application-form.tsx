"use client"

import * as React from "react"
import type { User } from "@prisma/client"

import { cn } from "@/lib/utils"
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
import { Icons } from "@/components/icons"
import { useOperatorApplicationForm } from "@/hooks/use-operator-application-form"

interface OperatorApplicationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">
}

export function OperatorApplicationForm({
  user,
  className,
  ...props
}: OperatorApplicationFormProps) {
  const {
    form,
    onSubmit,
    isSaving,
    isLoading,
    inputValue,
    suggestions,
    handleInputChange,
    handleAddressSelect,
    handleSuggestionsBlur,
  } = useOperatorApplicationForm({ user })

  const {
    handleSubmit,
    formState: { errors },
  } = form

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
                onBlur={handleSuggestionsBlur}
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
                      key={suggestion.placeId}
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
                        {suggestion.displayName.split(",")[0]}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {suggestion.displayName}
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
