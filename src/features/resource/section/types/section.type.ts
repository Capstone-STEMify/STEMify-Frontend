import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export type Section = {
  id: number
  description: string
  duration: number
  orderIndex: number
  status: string
  lessonId: number
  quizIds: number[]
  contentIds: number[]
}

export enum SectionStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted'
}

export type SectionOrderBy = {
  orderIndex?: number
}

// query params

export type SectionQueryParams = {
  lessonId?: number
} & SearchPaginatedRequestParams

//slice
export type SectionSliceParams = {
  lessonId?: number
} & SliceQueryParams
