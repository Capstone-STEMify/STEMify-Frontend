import { User } from '@/features/user/types/user.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type LicenseAssignment = {
  id: number
  organizationSubscriptionOrderId: number
  user: User
  status: LicenseAssignmentStatus
  assignedAt: string
  revokedAt?: string
  type: LicenseAssignmentType
}

export type LicenseAssignmentCreatePayload = {
  organizationSubscriptionOrderId: number
  userEmail: string
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
  ORGANIZATION_ADMIN = 'OrganizationAdmin'
}

export type LicenseAssignmentSliceParams = {
  organizationSubscriptionOrderId?: number
  userId?: string
  status?: LicenseAssignmentStatus
  type?: LicenseAssignmentType
} & SliceQueryParams
