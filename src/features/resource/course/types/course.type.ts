import { SearchPaginatedRequestParams } from '@/types/baseModel'
export enum CourseStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted'
}

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
}

export type CourseParams = {
  courseId?: number
} & SearchPaginatedRequestParams
