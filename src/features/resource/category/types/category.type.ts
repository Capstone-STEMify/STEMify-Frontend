import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Category = {
  id: number
  name: string
}

export type CategoryQueryParams = {
  // nothing here for now, but can be extended in the future
} & SearchPaginatedRequestParams

export type CategorySliceParams = {
  // nothing here for now, but can be extended in the future
} & SliceQueryParams
