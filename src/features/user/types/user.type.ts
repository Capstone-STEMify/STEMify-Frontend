import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { UserRole } from '@/types/userRole'

export type User = {
  userId: string
  email: string
  userName: string
  role: UserRole
  firstName: string
  lastName: string
  imageUrl?: string
}

export type UserFormData = Omit<User, 'id'> & {
  password?: string
}

export type UserQueryParams = {
  // nothing here for now, but can be extended in the future
} & SearchPaginatedRequestParams

export type UserSliceParams = {
  // nothing here for now, but can be extended in the future
} & SliceQueryParams
