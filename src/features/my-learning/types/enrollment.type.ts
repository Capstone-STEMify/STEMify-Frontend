import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum EnrollmentStatus {
  ALL = 'ALL',
  ACTIVE = 'Active', // Currently enrolled
  PENDING = 'Pending', // Waiting for approval
  WITHDRAWN = 'Withdrawn' // Student left the class
}

export enum EnrollmentOrderBy {
  CLASSROOM_NAME_ASC = 'classroomNameAsc',
  CLASSROOM_NAME_DESC = 'classroomNameDesc',
  ENROLLDATE_ASC = 'enrolledDateAsc',
  ENROLLDATE_DESC = 'enrolledDateDesc'
}

export type Enrollment = {
  id: string
  classroomName: string
  classroomId: string
  studentId: string
  coverImageUrl: string | null
  enrolledAt: string
}

// Query parameters for searching enrollments
export type EnrollmentQueryParams = {
  studentId?: string
  status?: EnrollmentStatus
  classroomId?: string
  orderBy?: EnrollmentOrderBy
} & SearchPaginatedRequestParams
