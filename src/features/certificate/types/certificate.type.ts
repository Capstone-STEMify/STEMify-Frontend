import { issue } from '@uiw/react-md-editor'

export type Certificate = {
  CertificateType: CertificateType
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
}

export enum CertificateType {
  COURSE = 'COURSE',
  CURRICULUM = 'CURRICULUM'
}
