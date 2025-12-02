import { Kit } from '@/features/resource/kit/types/kit.type'
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
  lessons: {
    id: number
    title: string
  }[]
  lessonCount?: number
  topicNames: string[]
  skillNames: string[]
  standardNames: string[]
  courseOrderIndex?: number
  kitId?: number
  price: number
  totalDuration?: number
}

export enum CourseStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted'
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
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
  title?: string
  courseId?: number
  createdByUserId?: string
  SkillId?: number
  ageRangeId?: number
  topicId?: number
  standardId?: number
  isPublic?: boolean
} & SliceQueryParams
