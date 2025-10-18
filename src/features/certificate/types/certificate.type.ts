import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'

export type Certificate = {
  CertificateType: CertificateType
  curriculumId?: number
  courseId?: number
  id: number
  userId: string
  userName: string
  courseEnrollmentId?: number
  curriculumEnrollmentId?: number
  issuedDate: string
  certificateUrl: string
  verificationCode: string
  courseTitle?: string
  curriculumTitle?: string
  courseEnrollments?: CourseEnrollment[]

}

export enum CertificateType {
  COURSE = 'COURSE',
  CURRICULUM = 'CURRICULUM'
}
