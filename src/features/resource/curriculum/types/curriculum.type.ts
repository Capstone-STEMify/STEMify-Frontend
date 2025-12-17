import { SearchPaginatedRequestParams } from '@/types/baseModel'
import { Course } from '../../course/types/course.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'

export type Curriculum = {
  id: number
  title: string
  code: string
  imageUrl: string
  description: string
  status: CurriculumStatus
  topics: string[]
  skills: string[]
  createdByUserId: string
  createdDate: string
  lastModifiedDate: string
  createdByUserName: string
  courseCount: number
  courses: Course[]
  kitIds?: number[]
  price: number
  learningOutcomes: string[]
  emulations: EmulatorWithThumbnail[]
}

export type CurriculumSliceParams = {
  status?: CurriculumStatus
  ageRangeId?: number
} & SliceQueryParams

export enum CurriculumStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  APPROVED = 'Approved'
}
