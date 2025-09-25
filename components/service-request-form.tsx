"use client"

import * as React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { useServiceRequestForm } from "@/hooks/use-service-request-form"

interface ServiceRequestFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: {
    id: string
    name: string | null
    email: string | null
  }
}

export function ServiceRequestForm({ user, className, ...props }: ServiceRequestFormProps) {
  const {
    form,
    onSubmit,
    isSaving,
    isLoadingAddresses,
    jobSiteInput,
    jobSiteSuggestions,
    handleJobSiteInputChange,
    handleAddressSelect,
  } = useServiceRequestForm({ user })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="grid gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Who should we contact about this service request?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  {...register("contactName")}
                  placeholder="John Doe"
                />
                {errors?.contactName && (
                  <p className="px-1 text-xs text-red-600">{errors.contactName.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="john@company.com"
                />
                {errors?.contactEmail && (
                  <p className="px-1 text-xs text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  {...register("contactPhone")}
                  placeholder="(555) 123-4567"
                />
                {errors?.contactPhone && (
                  <p className="px-1 text-xs text-red-600">{errors.contactPhone.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="ABC Construction"
                />
                {errors?.company && (
                  <p className="px-1 text-xs text-red-600">{errors.company.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Request Details</CardTitle>
            <CardDescription>
              Tell us about your equipment and operator needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Excavator needed for foundation work"
              />
              {errors?.title && (
                <p className="px-1 text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Additional details about the project requirements..."
                rows={3}
              />
              {errors?.description && (
                <p className="px-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Job Site Information</CardTitle>
            <CardDescription>
              Where will the work be performed?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="jobSite">Job Site Address</Label>
              <div className="relative">
                <Input
                  id="jobSite"
                  value={jobSiteInput}
                  onChange={(e) => handleJobSiteInputChange(e.target.value)}
                  placeholder="Enter job site address..."
                />
                {isLoadingAddresses && (
                  <Icons.spinner className="absolute right-3 top-3 size-4 animate-spin" />
                )}
                {jobSiteSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {jobSiteSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.placeId}
                        onClick={() => handleAddressSelect(suggestion)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleAddressSelect(suggestion)
                          }
                        }}
                        role="button"
                        tabIndex={0}
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
              {errors?.jobSite && (
                <p className="px-1 text-xs text-red-600">{errors.jobSite.message}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="transport">Equipment Transport</Label>
              <Select onValueChange={(value) => setValue("transport", value as "WE_HANDLE_IT" | "YOU_HANDLE_IT")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transport option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WE_HANDLE_IT">We handle transport</SelectItem>
                  <SelectItem value="YOU_HANDLE_IT">You handle transport</SelectItem>
                </SelectContent>
              </Select>
              {errors?.transport && (
                <p className="px-1 text-xs text-red-600">{errors.transport.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
                {errors?.startDate && (
                  <p className="px-1 text-xs text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                />
                {errors?.endDate && (
                  <p className="px-1 text-xs text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Requirements</CardTitle>
            <CardDescription>
              What type of equipment do you need?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="equipmentCategory">Equipment Category</Label>
              <Select onValueChange={(value) => setValue("equipmentCategory", value as "SKID_STEERS_TRACK_LOADERS" | "FRONT_END_LOADERS" | "BACKHOES_EXCAVATORS" | "BULLDOZERS" | "GRADERS" | "DUMP_TRUCKS" | "WATER_TRUCKS" | "SWEEPERS" | "TRENCHERS")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SKID_STEERS_TRACK_LOADERS">Skid Steers & Track Loaders</SelectItem>
                  <SelectItem value="FRONT_END_LOADERS">Front End Loaders</SelectItem>
                  <SelectItem value="BACKHOES_EXCAVATORS">Backhoes & Excavators</SelectItem>
                  <SelectItem value="BULLDOZERS">Bulldozers</SelectItem>
                  <SelectItem value="GRADERS">Graders</SelectItem>
                  <SelectItem value="DUMP_TRUCKS">Dump Trucks</SelectItem>
                  <SelectItem value="WATER_TRUCKS">Water Trucks</SelectItem>
                  <SelectItem value="SWEEPERS">Sweepers</SelectItem>
                  <SelectItem value="TRENCHERS">Trenchers</SelectItem>
                </SelectContent>
              </Select>
              {errors?.equipmentCategory && (
                <p className="px-1 text-xs text-red-600">{errors.equipmentCategory.message}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="equipmentDetail">Equipment Details</Label>
              <Textarea
                id="equipmentDetail"
                {...register("equipmentDetail")}
                placeholder="Specific equipment requirements, size, attachments needed..."
                rows={3}
              />
              {errors?.equipmentDetail && (
                <p className="px-1 text-xs text-red-600">{errors.equipmentDetail.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Duration & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Duration & Pricing</CardTitle>
            <CardDescription>
              How long do you need the equipment and what&apos;s your budget?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="grid gap-1">
                <Label htmlFor="requestedDurationType">Duration Type</Label>
                <Select onValueChange={(value) => setValue("requestedDurationType", value as "HALF_DAY" | "FULL_DAY" | "MULTI_DAY" | "WEEKLY")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HALF_DAY">Half Day (4 hours)</SelectItem>
                    <SelectItem value="FULL_DAY">Full Day (8 hours)</SelectItem>
                    <SelectItem value="MULTI_DAY">Multiple Days</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.requestedDurationType && (
                  <p className="px-1 text-xs text-red-600">{errors.requestedDurationType.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="requestedDurationValue">Duration Value</Label>
                <Input
                  id="requestedDurationValue"
                  type="number"
                  min="1"
                  {...register("requestedDurationValue", { valueAsNumber: true })}
                  placeholder="1"
                />
                {errors?.requestedDurationValue && (
                  <p className="px-1 text-xs text-red-600">{errors.requestedDurationValue.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="requestedTotalHours">Total Hours</Label>
                <Input
                  id="requestedTotalHours"
                  type="number"
                  {...register("requestedTotalHours", { valueAsNumber: true })}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="rateType">Rate Type</Label>
                <Select onValueChange={(value) => setValue("rateType", value as "HOURLY" | "HALF_DAY" | "DAILY" | "WEEKLY")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOURLY">Hourly</SelectItem>
                    <SelectItem value="HALF_DAY">Half Day</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.rateType && (
                  <p className="px-1 text-xs text-red-600">{errors.rateType.message}</p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="baseRate">Base Rate ($)</Label>
                <Input
                  id="baseRate"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("baseRate", { valueAsNumber: true })}
                  placeholder="500.00"
                />
                {errors?.baseRate && (
                  <p className="px-1 text-xs text-red-600">{errors.baseRate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardFooter>
            <button
              type="submit"
              className={cn(buttonVariants(), "w-full")}
              disabled={isSaving}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              <span>Submit Service Request</span>
            </button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
