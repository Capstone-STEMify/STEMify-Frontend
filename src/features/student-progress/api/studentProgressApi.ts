import { StudentProgress, StudentProgressQuery } from '@/features/student-progress/types/studentProgress.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const studentProgresssApi = createCrudApi<StudentProgress, StudentProgressQuery>({
  reducerPath: 'studentProgressApi',
  tagType: 'StudentProgress',
  baseUrl: '/student-progress'
})

export const {
  useGetByIdQuery: useGetStudentProgressByIdQuery,
  useLazyGetByIdQuery: useLazyGetStudentProgressByIdQuery,
  useSearchQuery: useSearchStudentProgressQuery,

  useUpdateMutation: useUpdateStudentProgressMutation
} = studentProgresssApi
