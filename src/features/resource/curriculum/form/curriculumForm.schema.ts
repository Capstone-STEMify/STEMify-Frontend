import z from 'zod'

/**
 * Upsert curriculum basic schema used for both create and update operations.
 */
export const curriculumSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters long'),
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  imageUrl: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Cover image is required')
    .refine((file) => file.size < 5 * 1024 * 1024, 'Max 5MB allowed')
    .optional(),
  imagePreviewUrl: z.string().optional()
})

/**
 * Type for curriculum form data based on the create curriculum schema.
 */
export type CurriculumFormData = z.infer<typeof curriculumSchema>
