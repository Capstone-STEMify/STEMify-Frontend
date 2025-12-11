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
import { agentApi } from '@/features/chat/api/agentApi'
import { certificateApi } from '@/features/certificate/api/certificateApi'
import { cartApi } from '@/features/cart/api/cartApi'
import { contactApi } from '@/features/contact/api/contactApi'
import { contractApi } from '@/features/contract/api/contractApi'
import { jobRoleApi } from '@/features/job-role/api/jobRoleApi'
import { quizApi } from '@/features/resource/quiz/api/quizApi'
import { emulatorApi } from '@/features/emulator/api/emulatorApi'
import { subscriptionApi } from '@/features/subscription/api/subscriptionApi'
import { licenseAssignmentApi } from '@/features/license-assignment/api/licenseAssignmentApi'
import { studentQuizApi } from '@/features/quiz/api/studentQuizApi'
import { organizationApi } from '@/features/organization/api/organizationApi'
import { classroomApi } from '@/features/classroom/api/classroomApi'
import { orgDashboardApi } from '@/features/dashboard/api/OrgDashboardApi'
import { studentAssignmentApi } from '@/features/assignment/api/studentAssignmentApi'
import { assignmentApi } from '@/features/assignment/api/assignmentApi'
import { groupApi } from '@/features/group/api/groupApi'
import { systemDashboardApi } from '@/features/dashboard/api/AdminDashboardApi'

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
  agentApi.middleware,
  certificateApi.middleware,
  cartApi.middleware,
  contactApi.middleware,
  contractApi.middleware,
  jobRoleApi.middleware,
  quizApi.middleware,
  emulatorApi.middleware,
  subscriptionApi.middleware,
  licenseAssignmentApi.middleware,
  studentQuizApi.middleware,
  organizationApi.middleware,
  classroomApi.middleware,
  studentAssignmentApi.middleware,
  assignmentApi.middleware,
  orgDashboardApi.middleware,
  groupApi.middleware,
  systemDashboardApi.middleware
  // Add your custom middlewares here
  // Example: loggerMiddleware, errorHandlingMiddleware, etc.
]
