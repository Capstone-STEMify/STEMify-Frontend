import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { ageRangeSlice } from '@/features/resource/age-range/slice/ageRangeSlice'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { categorySlice } from '@/features/resource/category/slice/categorySlice'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { courseSlice } from '@/features/resource/course/slice/courseSlice'
import { courseEnrollmentSlice } from '@/features/enrollment/slice/courseEnrollmentSlice'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { lessonSlice } from '@/features/resource/lesson/slice/lessonSlice'
import { sectionApi } from '@/features/resource/section/api/sectionApi'
import { sectionSlice } from '@/features/resource/section/slice/sectionSlice'
import { skillApi } from '@/features/resource/skill/api/skillApi'
import { skillSlice } from '@/features/resource/skill/slice/skillSlice'
import { standardApi } from '@/features/resource/standard/api/standardApi'
import { standardSlice } from '@/features/resource/standard/slice/standardSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { authSlice } from '@/features/auth/authSlice'
import { notificationSlice } from '@/features/notification/slice/notificationSlice'
import { notificationApi } from '@/features/notification/api/notificationApi'
import { contentApi } from '@/features/resource/content/api/contentApi'
import { studentProgressApi } from '@/features/student-progress/api/studentProgressApi'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { notificationRealtimeSlice } from '@/features/notification/slice/notificationRealtimeSlice'
import { userApi } from '@/features/user/api/userApi'
import { userSlice } from '@/features/user/slice/userSlice'
import { curriculumApi } from '@/features/resource/curriculum/api/curriculumApi'
import { learningOutcomeApi } from '@/features/resource/learning-outcome/api/learningOutcomeApi'
import { curriculumSlice } from '@/features/resource/curriculum/slice/curriculumSlice'
import { kitProductApi } from '@/features/resource/kit/api/kitProductApi'
import { kitProductSlice } from '@/features/resource/kit/slice/kitProductSlice'
import { strawLabSlice } from '@/features/creator-3d/slice/strawLabSlice'
import { creatorSceneSlice } from '@/features/creator-3d/slice/creatorSceneSlice'
import { courseLearningOutcomeApi } from '@/features/resource/learning-outcome/api/courseLearningOutcomeApi'
import { editorSlice } from '@/features/resource/content/slice/editorSlice'
import { lessonAssetSlice } from '@/features/resource/lesson-asset/slice/lessonAssestSlice'
import { lessonAssetSelectionSlice } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { tiptapSlice } from '@/components/tiptap/slice/tiptapSlice'
import { assemblySlice } from '@/features/assembly/slice/assemblySlice'
import { planApi } from '@/features/plan/api/planApi'
import { planProductSlice } from '@/features/plan/slice/planProductSlice'
import { workspaceTreeSlice } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { componentSlice } from '@/features/kit-components/slice/componentSlice'
import { componentApi } from '@/features/kit-components/api/kitComponentApi'
import { courseEnrollmentApi } from '@/features/enrollment/api/courseEnrollmentApi'
import { curriculumEnrollmentApi } from '@/features/enrollment/api/curriculumEnrollmentApi'
import { curriculumEnrollmentSlice } from '@/features/enrollment/slice/curriculumEnrollmentSlice'
import { chatAgentApi } from '@/features/chat/api/chatAgentApi'
import { certificateApi } from '@/features/certificate/api/certificateApi'
import { cartApi } from '@/features/cart/api/cartApi'
import { quizBuilderSlice } from '@/features/resource/quiz/slice/quiz-builder-slice'
import { quizPlayerSlice } from '@/features/resource/quiz/slice/quiz-player-slice'
import { contactSlice } from '@/features/contact/slice/contactSlice'
import { contactApi } from '@/features/contact/api/contactApi'
import { contractSlice } from '@/features/contract/slice/contractSlice'
import { contractApi } from '@/features/contract/api/contractApi'

export const rootReducer = combineReducers({
  // Add your reducers here
  auth: authSlice.reducer,
  course: courseSlice.reducer,
  lesson: lessonSlice.reducer,
  section: sectionSlice.reducer,
  ageRange: ageRangeSlice.reducer,
  category: categorySlice.reducer,
  skill: skillSlice.reducer,
  standard: standardSlice.reducer,
  courseEnrollment: courseEnrollmentSlice.reducer,
  curriculumEnrollment: curriculumEnrollmentSlice.reducer,
  notification: notificationSlice.reducer,
  studentProgress: studentProgressSlice.reducer,
  notificationRealtime: notificationRealtimeSlice.reducer,
  user: userSlice.reducer,
  curriculum: curriculumSlice.reducer,
  kit: kitProductSlice.reducer,
  strawLab: strawLabSlice.reducer,
  creatorScene: creatorSceneSlice.reducer,
  editor: editorSlice.reducer,
  lessonAsset: lessonAssetSlice.reducer,
  lessonAssetSelection: lessonAssetSelectionSlice.reducer,
  tiptap: tiptapSlice.reducer,
  assembly: assemblySlice.reducer,
  planProduct: planProductSlice.reducer,
  workspaceTree: workspaceTreeSlice.reducer,
  component: componentSlice.reducer,
  quizBuilder: quizBuilderSlice.reducer,
  quizPlayer: quizPlayerSlice.reducer,
  contactSlice: contactSlice.reducer,
  contractSlice: contractSlice.reducer,

  // api reducers
  [courseApi.reducerPath]: courseApi.reducer,
  [lessonApi.reducerPath]: lessonApi.reducer,
  [sectionApi.reducerPath]: sectionApi.reducer,
  [courseEnrollmentApi.reducerPath]: courseEnrollmentApi.reducer,
  [curriculumEnrollmentApi.reducerPath]: curriculumEnrollmentApi.reducer,
  [ageRangeApi.reducerPath]: ageRangeApi.reducer,
  [skillApi.reducerPath]: skillApi.reducer,
  [standardApi.reducerPath]: standardApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [studentProgressApi.reducerPath]: studentProgressApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [curriculumApi.reducerPath]: curriculumApi.reducer,
  [learningOutcomeApi.reducerPath]: learningOutcomeApi.reducer,
  [courseLearningOutcomeApi.reducerPath]: courseLearningOutcomeApi.reducer,
  [kitProductApi.reducerPath]: kitProductApi.reducer,
  [planApi.reducerPath]: planApi.reducer,
  [componentApi.reducerPath]: componentApi.reducer,
  [chatAgentApi.reducerPath]: chatAgentApi.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [contractApi.reducerPath]: contractApi.reducer
})
