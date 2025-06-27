import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/classroom/api/enrollmentApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { Middleware } from '@reduxjs/toolkit'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  enrollmentApi.middleware,
  classroomApi.middleware,
  lessonApi.middleware
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
