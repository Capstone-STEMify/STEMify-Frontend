import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum GroupStatus {
  ACTIVE = 'Active',
  ARCHIEVE = 'Archieve'
}

export type Group = {
  id: number
  organizationId: number
  name: string
  code: string
  status: GroupStatus
  studentCount: number
  createdByUserId: string
  createdAt: string
  updatedAt: string
  students: GroupDetailStudent[]
  studentIds?: string[]
}

export type GroupDetailStudent = {
  organizationUserId: string
  userId: string
  email: string
  userName: string
  fullName: string
  subscriptionOrderId: number
  joinedAt: string
  isActive: boolean
}

export type GroupQueryParams = {
  includeArchived?: boolean
  grade?: number
  activeOnly?: boolean
} & SearchPaginatedRequestParams

export type GroupSliceParams = {
  includeArchived?: boolean
  activeOnly?: boolean
} & SliceQueryParams
