import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Certificate = {
  id: number
  userId: string
  userName: string
  courseEnrollmentId?: number
  curriculumEnrollmentId?: number
  certificateType: CertificateType
  issueDate: string
  verificationCode: string
  certificateUrl: string
  title: string
  completedAt?: string
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