import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Organization = {
  id: number
  name: string
  organizationType: string
  description: string
  imageUrl?: string
  status: OrganizationStatus
  createdAt: string
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export type OrganizationType = {
  id: number
  name: string
}

export type OrganizationQueryParams = {} & SearchPaginatedRequestParams
