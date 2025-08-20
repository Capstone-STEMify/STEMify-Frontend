import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export const ROLES = ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'] as const
export type Role = (typeof ROLES)[number]

export type User = {
  userId: number
  email: string
  userName: string
  role: Role
  firstName: string
  lastName: string
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
