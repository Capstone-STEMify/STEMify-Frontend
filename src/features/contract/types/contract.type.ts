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
