import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/enrollment/api/enrollmentApi'
import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { ageRangeSlice } from '@/features/resource/age-range/slice/ageRangeSlice'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { categorySlice } from '@/features/resource/category/slice/categorySlice'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { courseSlice } from '@/features/resource/course/slice/courseSlice'
import { enrollmentSlice } from '@/features/enrollment/slice/enrollmentSlice'
import { lessonApi, lessonApiExtended } from '@/features/resource/lesson/api/lessonApi'
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
import { contentApi } from '@/features/content/api/contentApi'
import { studentProgresssApi } from '@/features/student-progress/api/studentProgressApi'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { notificationRealtimeSlice } from '@/features/notification/slice/notificationRealtimeSlice'

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
  enrollment: enrollmentSlice.reducer,
  notification: notificationSlice.reducer,
  studentProgress: studentProgressSlice.reducer,
  notificationRealtime: notificationRealtimeSlice.reducer,

  // api reducers
  [courseApi.reducerPath]: courseApi.reducer,
  [lessonApi.reducerPath]: lessonApi.reducer,
  [sectionApi.reducerPath]: sectionApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer,
  [classroomApi.reducerPath]: classroomApi.reducer,
  [ageRangeApi.reducerPath]: ageRangeApi.reducer,
  [skillApi.reducerPath]: skillApi.reducer,
  [standardApi.reducerPath]: standardApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [lessonApiExtended.reducerPath]: lessonApiExtended.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [studentProgresssApi.reducerPath]: studentProgresssApi.reducer
})
