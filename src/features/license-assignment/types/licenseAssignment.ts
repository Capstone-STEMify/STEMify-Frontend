import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type LicenseAssignment = {
  id: number
  organizationSubscriptionOrderId: number
  userId: string
  userName: string
  userEmail: string
  userImageUrl?: string
  status: LicenseAssignmentStatus
  assignedAt: string
  revokedAt?: string
  type: LicenseAssignmentType
}

export enum LicenseAssignmentStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  REVOKED = 'Revoked',
  PENDING = 'Pending'
}

export enum LicenseAssignmentType {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ORG_ADMIN = 'Organization Admin'
}

export type LicenseAssignmentSliceParams = {
    organizationSubscriptionOrderId?: number
    userId?: string
    status?: LicenseAssignmentStatus
    type?: LicenseAssignmentType
} & SliceQueryParams