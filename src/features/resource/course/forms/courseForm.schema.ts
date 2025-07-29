import { z } from 'zod'

/**
 * Upsert course basic schema used for both create and update operations.
 */
export const baseCourseSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  slug: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  ageRangeId: z.string().min(1, 'Age range is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  standards: z.array(z.string()).min(1, 'At least one standard is required'),
  imagePreviewUrl: z.string().optional()
})

/**
 * Create course schema — image is required.
 */
export const createCourseSchema = baseCourseSchema.extend({
  imageUrl: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Cover image is required')
    .refine((file) => file.size < 5 * 1024 * 1024, 'Max 5MB allowed')
})

/**
 * Update course schema — image is optional.
 */
export const updateCourseSchema = baseCourseSchema.extend({
  imageUrl: z.any().optional()
})

/**
 * Type for course form data based on the create course schema.
 */
export type CourseFormData = z.infer<typeof createCourseSchema>
