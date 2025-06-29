import { Enrollment, EnrollmentOrderBy, EnrollmentStatus } from '@/features/classroom/types/enrollment.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
export type EnrollmentParams = {
  studentId?: string
  status?: EnrollmentStatus
  classroomId?: string
  orderBy?: EnrollmentOrderBy
} & SearchPaginatedRequestParams

export const enrollmentApi = createCrudApi<Enrollment, EnrollmentParams>({
  reducerPath: 'enrollmentApi',
  tagType: 'Enrollment',
  baseUrl: '/enrollments'
})

export const {
  useSearchQuery: useSearchEnrollmentQuery,
  useGetAllQuery: useGetAllEnrollmentQuery,
  useCreateMutation: useCreateEnrollmentMutaion
} = enrollmentApi
