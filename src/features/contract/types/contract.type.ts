import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Contract = {
  id: number
  name: string
  description: string
  createdAt: string
  organizationName: string
}

export type ContractSliceParams = {} & SliceQueryParams

export type ContractQueryParams = {} & SearchPaginatedRequestParams
