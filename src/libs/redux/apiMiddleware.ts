import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/enrollment/api/enrollmentApi'
import { notificationApi } from '@/features/notification/api/notificationApi'
import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { sectionApi } from '@/features/resource/section/api/sectionApi'
import { skillApi } from '@/features/resource/skill/api/skillApi'
import { standardApi } from '@/features/resource/standard/api/standardApi'
import { Middleware } from '@reduxjs/toolkit'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  lessonApi.middleware,
  sectionApi.middleware,
  enrollmentApi.middleware,
  classroomApi.middleware,
  ageRangeApi.middleware,
  skillApi.middleware,
  categoryApi.middleware,
  standardApi.middleware,
  notificationApi.middleware
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
