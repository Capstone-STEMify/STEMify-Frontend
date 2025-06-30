import { ageRangeApi } from '@/features/age-range/api/ageRangeApi'
import { ageRangeSlice } from '@/features/age-range/slice/ageRangeSlice'
import { categoryApi } from '@/features/category/api/categoryApi'
import { categorySlice } from '@/features/category/slice/categorySlice'
import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/classroom/api/enrollmentApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { lessonSlice } from '@/features/resource/lesson/slice/lessonSlice'
import { skillApi } from '@/features/skill/api/skillApi'
import { skillSlice } from '@/features/skill/slice/skillSlice'
import { standardApi } from '@/features/standard/api/standardApi'
import { standardSlice } from '@/features/standard/slice/standardSlice'
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  // Add your reducers here
  lesson: lessonSlice.reducer,
  ageRange: ageRangeSlice.reducer,
  category: categorySlice.reducer,
  skill: skillSlice.reducer,
  standard: standardSlice.reducer,

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
