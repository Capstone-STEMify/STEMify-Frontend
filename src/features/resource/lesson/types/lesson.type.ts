import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum LessonStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
  IN_REVIEW = 'InReview',
  REJECTED = 'Rejected'
}

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
}

export type LessonParams = {
  courseId?: number
} & SearchPaginatedRequestParams
