import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type CourseLearningOutcome = {
  id: number
  courseId?: number
  name: string
  description: string
  programLearningOutcomeIds?: []
}

export type CourseLearningOutcomeQueryParams = {
  courseId?: number
} & SearchPaginatedRequestParams