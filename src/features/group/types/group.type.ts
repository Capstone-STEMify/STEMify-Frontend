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
  activeOnly?: boolean
} & SearchPaginatedRequestParams
