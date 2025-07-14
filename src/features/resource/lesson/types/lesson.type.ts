import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export type Lesson = {
  id: number
  title: string
  imageUrl: string
  description: string
  duration: number
  orderIndex: number
  status: LessonStatus
  createdByUserId: string
  courseId: number
  createdDate: string
  lastModifiedDate: string
  ageRangeLabel: string
  categoryNames: string[]
  skillNames: string[]
  standardNames: string[]
  sectionIds: number[]
}

export enum LessonStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
  IN_REVIEW = 'InReview',
  REJECTED = 'Rejected'
}

// query params
export type LessonQueryParams = {
  courseId?: number
  createdByUserId?: string
  ageRangeId?: number
  categoryId?: number
  skillId?: number
  standardId?: number
} & SearchPaginatedRequestParams

//slice
export type LessonSliceParams = {
  courseId?: number
  createdByUserId?: string
  ageRangeId?: number
  categoryId?: number
  skillId?: number
  standardId?: number
} & SliceQueryParams
