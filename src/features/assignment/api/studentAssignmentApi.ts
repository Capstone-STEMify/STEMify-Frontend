import { createCrudApi } from '@/libs/redux/baseApi'
import { AssignmentStatistics, StudentAssignmentQueryParam } from '../types/assigmentlistdetail.type'

export const studentAssignmentApi = createCrudApi<AssignmentStatistics, StudentAssignmentQueryParam>({
  reducerPath: 'studentAssignmentApi',
  tagTypes: ['StudentAssignment'],
  baseUrl: '/student-assignments'
})

export const {
  useGetByIdQuery: useGetStudentAssignmentByIdQuery,
  useSearchQuery: useSearchStudentAssignmentQuery,
  useGetAllQuery: useGetAllStudentAssignmentQuery,

  // lazy
  useLazyGetByIdQuery: useLazyGetStudentAssignmentByIdQuery,
  useLazySearchQuery: useLazySearchStudentAssignmentQuery,
  useLazyGetAllQuery: useLazyGetAllStudentAssignmentQuery
} = studentAssignmentApi
