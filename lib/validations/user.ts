import * as z from "zod"

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
})

export const operatorApplicationSchema = z.object({
  location: z.string().min(1, "Please select a location"),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  company: z.string().min(1).max(100).optional(),
  role: z.enum(["USER", "OPERATOR", "MANAGER", "ADMIN"]).optional(),
})
