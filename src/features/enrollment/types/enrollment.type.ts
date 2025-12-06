import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { issue } from '@uiw/react-md-editor'

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
  finalScore?: number
  status: string
  certificateUrl?: string
  certificateId?: number
  progressPercentage: number
  verificationCode?: string
  curriculumEnrollmentId?: number
  classroomId?: number
}

export type CurriculumEnrollment = {
  id: number
  studentId: string
  studentName?: string
  studentImageUrl?: string
  classroomId?: number
  curriculumId: number
  curriculumTitle: string
  coverImageUrl?: string
  description: string
  duration: number
  enrolledAt: string
  completedAt: any
  status: string
  certificateUrl?: string
  certificateId?: number
  issuedDate?: string
  progressPercentage: number
  courseEnrollments: CourseEnrollment[]
  verificationCode?: string
}

// Query
export type CourseEnrollmentQueryParams = {
  studentId?: string
  courseId?: number
  classroomId?: number
} & SearchPaginatedRequestParams

export type CurriculumEnrollmentQueryParams = {
  studentId?: string
  curriculumId?: number
  certificateId?: number
  verificationCode?: string
  classroomId?: number
} & SearchPaginatedRequestParams

// Slice
export type CourseEnrollmentSliceParams = {
  studentId?: string
  courseId?: number
} & SliceQueryParams

export type CurriculumEnrollmentSliceParams = {
  studentId?: string
  curriculumId?: number
  certificateId?: number
  verificationCode?: string
  classroomId?: number
} & SliceQueryParams

export type Enrollment = CourseEnrollment | CurriculumEnrollment
