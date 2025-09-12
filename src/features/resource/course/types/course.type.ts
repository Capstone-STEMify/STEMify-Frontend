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
  createdByUserName: string
  ageRangeId: number
  createdDate: string
  lastModifiedDate?: string
  reviewedAt?: string
  ageRangeLabel: string
  lessonIds: number[]
  topicNames: string[]
  skillNames: string[]
  standardNames: string[]
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

// Query
export type CourseQueryParams = {
  curriculumId?: number
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
