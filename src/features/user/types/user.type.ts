import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { UserRole } from '@/types/userRole'

export type User = {
  userId: string
  email: string
  userName: string
  userRole: UserRole
  firstName: string
  lastName: string
  imageUrl?: string
}

export type UserFormData = Omit<User, 'id'> & {
  password?: string
}

export type UserQueryParams = {
  role?: UserRole
  organizationId?: number
  subscriptionOrderId?: number
} & SearchPaginatedRequestParams

export type UserSliceParams = {
  role?: UserRole
  organizationId?: number
  subscriptionOrderId?: number
} & SliceQueryParams
