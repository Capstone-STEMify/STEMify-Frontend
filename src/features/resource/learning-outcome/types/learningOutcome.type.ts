import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type LearningOutcome = {
  id: number
  curriculumId?: number
  courseId?: number
  name: string
  description: string
}

export type LearningOutcomeQueryParams = {
  curriculumId?: number
  courseId?: number
} & SearchPaginatedRequestParams
