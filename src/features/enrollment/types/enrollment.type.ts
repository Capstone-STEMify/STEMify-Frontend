import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
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
  id: number
  studentId: string
  courseId: number
  courseTitle: string
  coverImageUrl: string
  description: string
  duration: number
  ageRangeLabel: string
  enrolledAt: string
  completedAt: any
  status: string
}

// Query
export type EnrollmentQueryParams = {
  studentId?: string
  courseId?: number
} & SearchPaginatedRequestParams

// Slice
export type EnrollmentSliceParams = {
  studentId?: string
  courseId?: number
} & SliceQueryParams
