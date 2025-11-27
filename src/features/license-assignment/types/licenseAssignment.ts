import { User } from '@/features/user/types/user.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type LicenseAssignment = {
  id: number
  organizationSubscriptionOrderId: number
  organizationId: number
  organizationName: string
  organizationImageUrl?: string
  planName: string
  user: User
  status: LicenseAssignmentStatus
  assignedAt: string
  revokedAt?: string
  type: LicenseAssignmentType
}

export type LicenseAssignmentCreatePayload = {
  email: string
  role: LicenseAssignmentType
  subscription_order_id: string
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

export type UploadBulkCsvInvitation = {
  csv_data: string
  file_name: string
  subscription_order_id: string
  organization_id: string
}
