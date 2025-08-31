import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { Course } from '../../course/types/course.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Curriculum = {
  id: number
  name: string
  description?: string
  imageUrl?: string
  courses: Course[]
  createdAt: string
  updatedAt?: string
  approvedAt?: string
  status: CurriculumStatus
  ageRangeLabel: string
  kitIds: number[]
}

export type CurriculumQueryParams = {
  status?: CurriculumStatus
  ageRangeId?: number
} & SearchPaginatedRequestParams

export type CurriculumSliceParams = {
  curriculumId?: number
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
