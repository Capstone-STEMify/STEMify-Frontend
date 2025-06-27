import { classroomApi } from '@/features/classroom/api/classroomApi'
import { enrollmentApi } from '@/features/classroom/api/enrollmentApi'
import { courseApi } from '@/features/resource/course/api/courseApi'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
  // Add your reducers here
  // api reducers
  [courseApi.reducerPath]: courseApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer,
  [classroomApi.reducerPath]: classroomApi.reducer,
  [lessonApi.reducerPath]: lessonApi.reducer
})
