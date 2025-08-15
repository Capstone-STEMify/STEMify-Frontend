import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
// models
export type Course = {
  id: number
  title: string
  code: string
  imageUrl?: string
  slug: string
  description: string
  studentTasks: string
  prerequisites?: string
  duration: number
  status: CourseStatus
  level: CourseLevel
  createdByUserId: string
  reviewedByUserId?: string
  ageRangeId: number
  createdDate: string // DateTimeOffset → string (ISO format)
  lastModifiedDate?: string // DateTimeOffset? → string | undefined
  reviewedAt?: string // DateTime? → string | undefined
  ageRangeLabel: string
  lessonIds: number[]
  topicNames: string[]
  skillNames: string[]
  standardNames: string[]
}

export enum CourseStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  APPROVED = 'Approved'
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

// Query
export type CourseQueryParams = {
  courseId?: number
  createdByUserId?: string
  skillId?: number
  ageRangeId?: number
  topicId?: number
  standardId?: number
  isPublic?: boolean
} & SearchPaginatedRequestParams

// Slice
export type CourseSliceParams = {
  courseId?: number
  createdByUserId?: string
  SkillId?: number
  ageRangeId?: number
  topicId?: number
  standardId?: number
  isPublic?: boolean
} & SliceQueryParams
