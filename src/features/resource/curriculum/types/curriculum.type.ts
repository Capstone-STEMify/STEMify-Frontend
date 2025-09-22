import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { Course } from '../../course/types/course.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Curriculum = {
  id: number
  title: string
  code: string
  imageUrl: string
  description: string
  status: CurriculumStatus
  topicNames: string[]
  skillNames: string[]
  createdByUserId: string
  createdDate: string
  lastModifiedDate: string
  createdByUserName: string
  courseCount: number
  kits: any[]
  courses: Course[]
  kitIds?: {
    values: number[]
  }
}

export type CurriculumSliceParams = {
  status?: CurriculumStatus
  ageRangeId?: number
} & SliceQueryParams

export enum CurriculumStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED'
}
