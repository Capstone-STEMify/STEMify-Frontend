import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
// models
export type Course = {
  id: number
  title: string
  imageUrl: string
  slug: string
  description: string
  numberOfSection: number
  duration: number
  status: CourseStatus
  downloadCount: number
  isPublic: boolean
  createdByUserId: string
  ageRangeId: number
  createdDate: string
  lastModifiedDate: string
  ageRangeLabel: string
  categoryNames: string[]
  skillNames: string[]
  standardNames: string[]
  lessonIds: number[]
}

export enum CourseStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
  INREVIEW = 'InReview',
  REJECTED = 'Rejected'
}

// Query
export type CourseQueryParams = {
  courseId?: number
  createdByUserId?: string
  skillId?: number
  ageRangeId?: number
  categoryId?: number
  standardId?: number
  isPublic?: boolean
} & SearchPaginatedRequestParams

// Slice
export type CourseSliceParams = {
  courseId?: number
  createdByUserId?: string
  SkillId?: number
  ageRangeId?: number
  categoryId?: number
  standardId?: number
  isPublic?: boolean
} & SliceQueryParams
