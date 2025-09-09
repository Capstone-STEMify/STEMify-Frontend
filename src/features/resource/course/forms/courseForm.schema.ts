import { CourseLevel } from '@/features/resource/course/types/course.type'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

export function useCourseSchemas() {
  const tv = useTranslations('validation')

  const baseCourseSchema = z.object({
    code: z.string().min(3, tv('course.code', { length: 3 })),
    title: z.string().min(10, tv('course.title', { length: 10 })),
    studentTasks: z.string().min(10, tv('course.studentTasks', { length: 10 })),
    prerequisites: z.string().optional(),
    level: z.enum(CourseLevel),
    slug: z.string().optional(),
    description: z.string().min(50, tv('course.description', { length: 50 })),
    ageRangeId: z.string().min(1, tv('course.ageRangeId')),
    imagePreviewUrl: z.string().optional()
  })

  const createCourseSchema = baseCourseSchema.extend({
    imageUrl: z
      .instanceof(File)
      .refine((file) => file.size > 0, tv('course.image'))
      .refine((file) => file.size < 5 * 1024 * 1024, tv('course.imgSize', { size: 5 }))
      .optional()
  })

  const updateCourseSchema = baseCourseSchema.extend({
    imageUrl: z.any().optional()
  })

  return { baseCourseSchema, createCourseSchema, updateCourseSchema }
}

export type CourseFormData =
  | z.infer<ReturnType<typeof useCourseSchemas>['createCourseSchema']>
  | z.infer<ReturnType<typeof useCourseSchemas>['updateCourseSchema']>
