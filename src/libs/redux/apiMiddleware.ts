import { contentApi } from '@/features/resource/content/api/contentApi'
import { enrollmentApi } from '@/features/enrollment/api/enrollmentApi'
import { notificationApi } from '@/features/notification/api/notificationApi'
import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { curriculumApi } from '@/features/resource/curriculum/api/curriculumApi'
import { learningOutcomeApi } from '@/features/resource/learning-outcome/api/learningOutcomeApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { sectionApi } from '@/features/resource/section/api/sectionApi'
import { skillApi } from '@/features/resource/skill/api/skillApi'
import { standardApi } from '@/features/resource/standard/api/standardApi'
import { studentProgressApi } from '@/features/student-progress/api/studentProgressApi'
import { userApi } from '@/features/user/api/userApi'
import { Middleware } from '@reduxjs/toolkit'
import { kitApi } from '@/features/resource/kit/api/kitApi'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  lessonApi.middleware,
  sectionApi.middleware,
  enrollmentApi.middleware,
  ageRangeApi.middleware,
  skillApi.middleware,
  categoryApi.middleware,
  standardApi.middleware,
  notificationApi.middleware,
  contentApi.middleware,
  studentProgressApi.middleware,
  userApi.middleware,
  curriculumApi.middleware,
  learningOutcomeApi.middleware,
  kitApi.middleware
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
