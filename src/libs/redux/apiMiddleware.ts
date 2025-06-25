import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/classroom/api/enrollmentApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { Middleware } from '@reduxjs/toolkit'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  enrollmentApi.middleware,
  classroomApi.middleware,
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
