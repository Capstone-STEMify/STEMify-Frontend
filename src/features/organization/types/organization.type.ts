import { OrganizationSubscription } from '@/features/subscription/types/subscription.type'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Organization = {
  id: number
  name: string
  organizationType: string
  description: string
  imageUrl: string
  status: OrganizationStatus
  createdDate: string
  lastModifiedDate: string
  subscriptions: Partial<OrganizationSubscription>[]
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVE = 'Archive',
  DRAFT = 'Draft'
}

export type OrganizationType = {
  id: number
  name: string
}

export type OrganizationQueryParams = {
  status?: OrganizationStatus
} & SearchPaginatedRequestParams

// Form Data
export type OrganizationFormData = {
  name: string
  description: string
  organizationTypeId: string
  image: File | null
  imageUrl?: string
}
