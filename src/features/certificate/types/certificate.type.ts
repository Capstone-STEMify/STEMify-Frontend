import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Certificate = {
  certificateType: CertificateType
  curriculumId?: number
  courseId?: number
  id: number
  userId: string
  userName: string
  courseEnrollmentId?: number
  curriculumEnrollmentId?: number
  issueDate?: string
  certificateUrl: string
  verificationCode: string
  title: string
  completedAt?: string
  lessons?: string[]
  courseEnrollments?: CourseEnrollment[]
  userImageUrl?: string
}

export enum CertificateType {
  COURSE = 'Course',
  CURRICULUM = 'Curriculum'
}

export type CertificateQueryParams = {
  userId?: string
  courseEnrollmentId?: number
  verificationCode?: string
} & SearchPaginatedRequestParams
