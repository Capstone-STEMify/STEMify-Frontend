import { contentApi } from '@/features/resource/content/api/contentApi'
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
import { kitProductApi } from '@/features/resource/kit/api/kitProductApi'
import { courseLearningOutcomeApi } from '@/features/resource/learning-outcome/api/courseLearningOutcomeApi'
import { planApi } from '@/features/plan/api/planApi'
import { componentApi } from '@/features/kit-components/api/kitComponentApi'
import { courseEnrollmentApi } from '@/features/enrollment/api/courseEnrollmentApi'
import { curriculumEnrollmentApi } from '@/features/enrollment/api/curriculumEnrollmentApi'
import { chatAgentApi } from '@/features/chat/api/chatAgentApi'
import { certificateApi } from '@/features/certificate/api/certificateApi'
import { cartApi } from '@/features/cart/api/cartApi'
import { contactApi } from '@/features/contact/api/contactApi'

export const apiMiddlewares: Middleware[] = [
  courseApi.middleware,
  lessonApi.middleware,
  sectionApi.middleware,
  courseEnrollmentApi.middleware,
  curriculumEnrollmentApi.middleware,
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
  courseLearningOutcomeApi.middleware,
  kitProductApi.middleware,
  planApi.middleware,
  componentApi.middleware,
  chatAgentApi.middleware,
  certificateApi.middleware,
  cartApi.middleware,
  contactApi.middleware,
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
