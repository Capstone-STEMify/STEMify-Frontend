import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { LicenseType, UserRole } from '@/types/userRole'

export type User = {
  userId: string
  email: string
  userName: string
  userRole: UserRole //'Admin' | 'Staff' | 'Member' | 'Guest'
  firstName: string
  lastName: string
  imageUrl?: string
  status: UserStatus
  organizations?: UserOrganization[]
}

export type OrganizationSubscription = {
  id: number
  role: LicenseType
  properties: Record<string, any>
  isActive: boolean
}

export type UserOrganization = {
  id: number // Organization ID
  subscriptions: OrganizationSubscription[]
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
