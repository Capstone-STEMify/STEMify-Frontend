import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import {
  AssignmentStatistics,
  StudentAssignmentDetail,
  StudentAssignmentQueryParam,
  GradeSubmissionPayload,
  CreateAttemptPayload
} from '../types/assigmentlistdetail.type'

export const studentAssignmentApi = createApi({
  reducerPath: 'studentAssignmentApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['StudentAssignment', 'StudentAssignmentDetail'],
  endpoints: (builder) => ({
    search: builder.query<ApiSuccessResponse<PaginatedResult<AssignmentStatistics>>, StudentAssignmentQueryParam>({
      query: (params) => ({
        url: '/student-assignments',
        method: 'GET',
        params: params
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.items.map(({ assignmentId }) => ({
                type: 'StudentAssignment' as const,
                id: assignmentId
              })),
              { type: 'StudentAssignment', id: 'LIST' }
            ]
          : [{ type: 'StudentAssignment', id: 'LIST' }]
    }),
    getById: builder.query<ApiSuccessResponse<StudentAssignmentDetail>, number | string | undefined>({
      query: (id) => `/student-assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'StudentAssignmentDetail', id }]
    }),

    getAssignmentDetailById: builder.query<
      ApiSuccessResponse<AssignmentStatistics>,
      { classroomId: number; assignmentId: number }
    >({
      query: ({ classroomId, assignmentId }) => ({
        url: `/classrooms/${classroomId}/assignments/${assignmentId}/student-assignments`,
        method: 'GET'
      }),
      providesTags: (result, error, { assignmentId }) => [{ type: 'StudentAssignment', id: assignmentId }]
    }),

    gradeAssignmentAttempt: builder.mutation<
      ApiSuccessResponse<any>,
      {
        attemptId: number
        studentAssignmentId: number
        body: GradeSubmissionPayload
      }
    >({
      query: ({ attemptId, body }) => ({
        url: `/assignment-attempts/${attemptId}`,
        method: 'PATCH',
        body: body
      }),
      invalidatesTags: (result, error, { studentAssignmentId }) => [
        { type: 'StudentAssignment', id: 'LIST' },
        { type: 'StudentAssignmentDetail', id: studentAssignmentId }
      ]
    }),
    createAssignmentAttempt: builder.mutation<
      ApiSuccessResponse<any>,
      {
        body: CreateAttemptPayload
      }
    >({
      query: ({ body }) => ({
        url: `/assignment-attempts`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: (result, error, { body }) => [{ type: 'StudentAssignmentDetail', id: body.studentAssignmentId }]
    })
  })
})

export const {
  useSearchQuery: useSearchStudentAssignmentQuery,
  useLazySearchQuery: useLazySearchStudentAssignmentQuery,
  useGetByIdQuery: useGetStudentAssignmentByIdQuery,
  useGetAssignmentDetailByIdQuery,
  useLazyGetByIdQuery: useLazyGetStudentAssignmentByIdQuery,
  useGradeAssignmentAttemptMutation,
  useCreateAssignmentAttemptMutation
} = studentAssignmentApi
