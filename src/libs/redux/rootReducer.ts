import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/my-learning/api/enrollmentApi'
import { ageRangeApi } from '@/features/resource/age-range/api/ageRangeApi'
import { ageRangeSlice } from '@/features/resource/age-range/slice/ageRangeSlice'
import { categoryApi } from '@/features/resource/category/api/categoryApi'
import { categorySlice } from '@/features/resource/category/slice/categorySlice'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { courseSlice } from '@/features/resource/course/slice/courseSlice'
import { enrollmentSlice } from '@/features/resource/course/slice/enrollmentSlice'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { lessonSlice } from '@/features/resource/lesson/slice/lessonSlice'
import { skillApi } from '@/features/resource/skill/api/skillApi'
import { skillSlice } from '@/features/resource/skill/slice/skillSlice'
import { standardApi } from '@/features/resource/standard/api/standardApi'
import { standardSlice } from '@/features/resource/standard/slice/standardSlice'
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  // Add your reducers here
  course: courseSlice.reducer,
  lesson: lessonSlice.reducer,
  ageRange: ageRangeSlice.reducer,
  category: categorySlice.reducer,
  skill: skillSlice.reducer,
  standard: standardSlice.reducer,
  enrollment: enrollmentSlice.reducer,

  // api reducers
  [courseApi.reducerPath]: courseApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer,
  [classroomApi.reducerPath]: classroomApi.reducer,
  [lessonApi.reducerPath]: lessonApi.reducer,
  [ageRangeApi.reducerPath]: ageRangeApi.reducer,
  [skillApi.reducerPath]: skillApi.reducer,
  [standardApi.reducerPath]: standardApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer
})
