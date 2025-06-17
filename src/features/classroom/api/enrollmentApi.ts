import { Classroom } from '@/features/classroom/types/classroom'
import { Enrollment } from '@/features/classroom/types/enrollment'
import { injectCrudEndpoints } from '@/libs/redux/injectCrudEndpoints'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { EnrollmentStatus } from '@/types/enum'

export type EnrollmentParams = {
  studentId?: string
  status?: EnrollmentStatus
  classroomId?: string
} & SearchPaginatedRequestParams

export const classroomApi = injectCrudEndpoints<Enrollment, EnrollmentParams>({
  tagType: 'Enrollment',
  baseUrl: '/enrollments'
})

export const { useSearchQuery: useSearchEnrollmentQuery } = classroomApi
