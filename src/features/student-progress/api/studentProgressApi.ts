import {
  ProgressStatus,
  StudentProgress,
  StudentProgressQuery,
  UpdateSectionStudentProgress
} from '@/features/student-progress/types/studentProgress.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const studentProgressApi = createCrudApi<StudentProgress, StudentProgressQuery>({
  reducerPath: 'studentProgressApi',
  tagTypes: ['StudentProgress'],
  baseUrl: '/student-progress'
}).injectEndpoints({
  endpoints: (builder) => ({
    // lesson progress
    getLessonStudentProgress: builder.query<
      ApiSuccessResponse<PaginatedResult<StudentProgress>>,
      { enrollmentId?: number }
    >({
      query: ({ enrollmentId }) => ({
        url: `/student-progress/lessons`,
        method: 'GET',
        params: { enrollmentId }
      }),
      providesTags: ['StudentProgress']
    }),
    updateLessonStudentProgress: builder.mutation<void, { lessonId: number; enrollmentId: number }>({
      query: ({ lessonId, enrollmentId }) => ({
        url: `/student-progress/lessons`,
        method: 'PATCH',
        body: { lessonId, enrollmentId }
      }),
      invalidatesTags: ['StudentProgress']
    }),

    // section progress
    getSectionStudentProgress: builder.query<
      ApiSuccessResponse<PaginatedResult<StudentProgress>>,
      { enrollmentId?: number; lessonId?: number }
    >({
      query: ({ enrollmentId, lessonId }) => ({
        url: `/student-progress/sections`,
        method: 'GET',
        params: { enrollmentId, lessonId }
      }),
      providesTags: ['StudentProgress']
    }),
    updateSectionStudentProgress: builder.mutation<void, UpdateSectionStudentProgress>({
      query: ({ sectionId, enrollmentId, lessonId, status }) => ({
        url: `/student-progress/sections`,
        method: 'PATCH',
        body: { sectionId, enrollmentId, lessonId, status }
      }),
      invalidatesTags: ['StudentProgress']
    })
  })
})

export const {
  // new lesson progress api
  useGetLessonStudentProgressQuery,
  useUpdateLessonStudentProgressMutation,

  // new section progress api
  useGetSectionStudentProgressQuery,
  useUpdateSectionStudentProgressMutation
} = studentProgressApi
