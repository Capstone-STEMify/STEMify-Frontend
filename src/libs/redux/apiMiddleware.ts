import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/classroom/api/enrollmentApi'
import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { skillApi } from '@/features/resource/skill/api/skillApi'
import { standardApi } from '@/features/resource/standard/api/standardApi'
import { Middleware } from '@reduxjs/toolkit'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  enrollmentApi.middleware,
  classroomApi.middleware,
  lessonApi.middleware,
  ageRangeApi.middleware,
  skillApi.middleware,
  categoryApi.middleware,
  standardApi.middleware
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
