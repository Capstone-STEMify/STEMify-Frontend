import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { LicenseType, UserRole } from '@/types/userRole'

export type User = {
  userId: string
  email: string
  name: string
  userName: string
  userRole: UserRole //'Admin' | 'Staff' | 'Member' | 'Guest'
  firstName: string
  lastName: string
  imageUrl?: string
  status: UserStatus
  isActive: boolean
  organizations?: {
    role: UserRole
    organizations: UserOrganization[]
  }
  subscriptions: {
    subscriptionOrderId: number
    licenseType: LicenseType
    joinedAt: string
  }[]
}

export type OrganizationSubscription = {
  subscriptionId: number
  type: LicenseType
}

export type UserOrganization = {
  id: number // Organization ID
  organizationUserId: string
  roles: OrganizationSubscription[]
}

export type UserFormData = Omit<User, 'id'> & {
  password?: string
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  SUSPENDED = 'Suspended',
  DELETED = 'Deleted'
}

export type UserQueryParams = {
  role?: UserRole
  organizationId?: number
  subscriptionOrderId?: number
} & SearchPaginatedRequestParams

export type UserSliceParams = {
  role?: UserRole
  subscription_order_id?: number | null
  license_type?: string | null
} & SliceQueryParams

// Organization User Types
export type OrganizationUser = {
  userId: string
  grade?: string
  email: string
  userName: string
  fullName: string
  firstName: string
  lastName: string
  lastLoginAt: string
  organizationUserId: string
  organizationId: number
  licenseAssignmentId: string
  isActive: boolean
  joinedAt: string
  groupName: string
  groupCode: string
  bio: string
  studentDateOfBirth: string
  studentMajor: string
  teacherSpecialization: string
  subscriptions: OrganizationUserSubscription[]
}

export type OrganizationUserSubscription = {
  subscriptionOrderId: number
  licenseType: string
  licenseAssignmentId: string
  isActive: boolean
  joinedAt: string
}

export type OrganizationUserQueryParams = {
  organizationId: number
  pageNumber?: number
  pageSize?: number
  role?: LicenseType
  email?: string
}
