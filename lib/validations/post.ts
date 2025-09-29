import * as z from "zod"
import { Prisma } from "@prisma/client"

// EditorJS block structure
const editorJSBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
})

// EditorJS output structure
const editorJSContentSchema = z.object({
  time: z.number().optional(),
  blocks: z.array(editorJSBlockSchema),
  version: z.string().optional(),
})

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  content: z.custom<Prisma.InputJsonValue>().optional(),
})
