import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'
// models
export type Course = {
  id: number
  code: string
  title: string
  imageUrl: string
  slug: string
  description: string
  studentTasks: string
  prerequisites?: string
  duration: number
  status: CourseStatus
  level: CourseLevel
  createdByUserId: string
  ageRangeId: number
  createdDate: string
  lastModifiedDate: string
  ageRangeLabel: string
  topicNames: string[]
  skillNames: string[]
  standardNames: string[]
  lessonIds: number[]
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
