import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Standard = {
  id: number
  standardName: string
}

export type StandardQueryParams = {
  // nothing here for now, but can be extended in the future
} & SearchPaginatedRequestParams

export type StandardSliceParams = {
  // nothing here for now, but can be extended in the future
} & SliceQueryParams
