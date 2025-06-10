import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/customBaseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['Lesson', 'User', 'Course'],
  endpoints: () => ({})
})

// Define all tag types used in the application
// It should match the tagTypes defined in the baseApi
export type AllTagTypes = 'Lesson' | 'User' | 'Course'
