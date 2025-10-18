import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export enum EnrollmentStatus {
  ALL = 'ALL',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  DROPPED = 'Dropped',
  NOT_STARTED = 'NotStarted'
}

export enum EnrollmentOrderBy {
  CLASSROOM_NAME_ASC = 'classroomNameAsc',
  CLASSROOM_NAME_DESC = 'classroomNameDesc',
  ENROLLDATE_ASC = 'enrolledDateAsc',
  ENROLLDATE_DESC = 'enrolledDateDesc'
}

export type CourseEnrollment = {
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
  certificateUrl?: string
  certificateId?: number
  progressPercentage: number
}

export type CurriculumEnrollment = {
  id: number
  studentId: string
  curriculumId: number
  curriculumTitle: string
  coverImageUrl: string
  description: string
  duration: number
  enrolledAt: string
  completedAt: any
  status: string
  certificateUrl?: string
  certificateId?: number
  progressPercentage: number
  courseEnrollments: CourseEnrollment[]
}

// Query
export type CourseEnrollmentQueryParams = {
  studentId?: string
  courseId?: number
} & SearchPaginatedRequestParams

// Slice
export type CourseEnrollmentSliceParams = {
  studentId?: string
  courseId?: number
} & SliceQueryParams

export type CurriculumEnrollmentSliceParams = {
  studentId?: string
  curriculumId?: number
} & SliceQueryParams

export type Enrollment = CourseEnrollment | CurriculumEnrollment
