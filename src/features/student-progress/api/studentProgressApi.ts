import { StudentProgress, StudentProgressQuery } from '@/features/student-progress/types/studentProgress.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const studentProgresssApi = createCrudApi<StudentProgress, StudentProgressQuery>({
  reducerPath: 'studentProgressApi',
  tagType: 'StudentProgress',
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
      })
    }),
    updateLessonStudentProgress: builder.mutation<void, { lessonId: number; enrollmentId: number }>({
      query: ({ lessonId, enrollmentId }) => ({
        url: `/student-progress/lesson`,
        method: 'PUT',
        body: { lessonId, enrollmentId }
      })
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
      })
    }),
    updateSectionStudentProgress: builder.mutation<void, { sectionId: number; enrollmentId: number; lessonId: number }>(
      {
        query: ({ sectionId, enrollmentId, lessonId }) => ({
          url: `/student-progress/section`,
          method: 'PUT',
          body: { sectionId, enrollmentId, lessonId }
        })
      }
    )
  })
})

export const {
  // new lesson progress api
  useGetLessonStudentProgressQuery,
  useUpdateLessonStudentProgressMutation,

  // new section progress api
  useGetSectionStudentProgressQuery,
  useUpdateSectionStudentProgressMutation
} = studentProgresssApi
