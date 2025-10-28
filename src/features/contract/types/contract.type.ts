import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Contract = {
  id: number
  name: string
  description: string
  createdAt: string
  organization: {
    id: number
    name: string
    organizationType: string
    imageUrl: string
  }
  fileUrl: string
  status: string
}

export type ContractSliceParams = {} & SliceQueryParams

export type ContractQueryParams = {} & SearchPaginatedRequestParams

// Form Data
export type ContractFormData = {
  name: string
  // organizationId: number this should be included in request but not in the form
  description: string
  fileBase64: string
  previewUrlFromServer?: string
}
