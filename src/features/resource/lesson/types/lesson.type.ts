import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export type Lesson = {
  id: number
  title: string
  imageUrl?: string
  description: string
  learningOutcome: string
  requirement?: string
  duration: number
  orderIndex: number
  status: LessonStatus
  createdByUserId: string
  createdByUserName: string
  courseId: number
  createdDate: string
  lastModifiedDate?: string
  ageRangeLabel: string
  sectionIds: number[]
  topicNames: string[]
  skillNames: string[]
  standardNames: string[]
}

export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED'
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
