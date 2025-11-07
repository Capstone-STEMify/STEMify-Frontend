import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQueryWithErrorHandling } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import {
  AssignmentStatistics,
  StudentAssignmentDetail,
  StudentAssignmentQueryParam
} from '../types/assigmentlistdetail.type'

export const studentAssignmentApi = createApi({
  reducerPath: 'studentAssignmentApi',
  baseQuery: customFetchBaseQueryWithErrorHandling,
  tagTypes: ['StudentAssignment', 'StudentAssignmentDetail'],
  endpoints: (builder) => ({
    search: builder.query<ApiSuccessResponse<PaginatedResult<AssignmentStatistics>>, StudentAssignmentQueryParam>({
      query: (params) => {
        return {
          url: '/student-assignments',
          method: 'GET',
          params: params
        }
      },
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
    })
  })
})

export const {
  useSearchQuery: useSearchStudentAssignmentQuery,
  useLazySearchQuery: useLazySearchStudentAssignmentQuery,
  useGetByIdQuery: useGetStudentAssignmentByIdQuery,
  useLazyGetByIdQuery: useLazyGetStudentAssignmentByIdQuery
} = studentAssignmentApi
