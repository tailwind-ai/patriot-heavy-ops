import * as z from "zod"

// EditorJS block structure
const editorJSBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
})

// EditorJS output structure - using z.any() for Prisma JSON compatibility
const editorJSContentSchema = z.object({
  time: z.number().optional(),
  blocks: z.array(editorJSBlockSchema),
  version: z.string().optional(),
}).or(z.any()) // Allow any for Prisma JSON field compatibility

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  content: editorJSContentSchema.optional(),
})
