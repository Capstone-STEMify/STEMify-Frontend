import { Organization } from '@/features/organization/types/organization.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum ContractStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  ARCHIVED = 'Archived'
}

export type Contract = {
  id: number
  name: string
  description: string
  createdAt: string
  organization: Partial<Organization>
  fileUrl?: string
  file?: string
  previewUrlFromServer?: string
  status: ContractStatus
}

export type ContractSliceParams = {} & SliceQueryParams

export type ContractQueryParams = {} & SearchPaginatedRequestParams

// Form Data
export type ContractFormData = {
  name: string
  // organizationId: number this should be included in request but not in the form
  description: string
  file: string
  previewUrlFromServer?: string
}
