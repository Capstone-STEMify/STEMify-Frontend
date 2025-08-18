import { CourseLevel } from '@/features/resource/course/types/course.type'
import { z } from 'zod'

/**
 * Upsert course basic schema used for both create and update operations.
 */
export const baseCourseSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters long'),
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  studentTasks: z.string().min(10, 'Student tasks must be at least 10 characters long'),
  prerequisites: z.string().min(3, 'Prerequisites must be at least 3 characters long'),
  level: z.enum(CourseLevel),
  slug: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  ageRangeId: z.string().min(1, 'Age range is required'),
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
