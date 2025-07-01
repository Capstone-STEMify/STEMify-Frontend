import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export type AgeRange = {
  id: number
  ageRangeLabel: string
  minAge: number
  maxAge: number
}

// query
export type AgeRangeQueryParams = {
  age?: number
} & SearchPaginatedRequestParams

// slice
export type AgeRangeSliceParams = {
  age?: number
} & SliceQueryParams
