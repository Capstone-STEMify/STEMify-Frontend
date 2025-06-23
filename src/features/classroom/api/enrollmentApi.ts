import { Enrollment } from '@/features/classroom/types/enrollment'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { EnrollmentStatus } from '@/types/enum'

export type EnrollmentParams = {
  studentId?: string
  status?: EnrollmentStatus
  classroomId?: string
} & SearchPaginatedRequestParams

export const enrollmentApi = createCrudApi<Enrollment, EnrollmentParams>({
  reducerPath: 'enrollmentApi',
  tagType: 'Enrollment',
  baseUrl: '/enrollments'
})

export const { useSearchQuery: useSearchEnrollmentQuery } = enrollmentApi
