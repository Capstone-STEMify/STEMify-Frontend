import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum ProgressStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed'
}

export type ProgressType = 'lesson' | 'section'

export type BaseProgress = {
  lessonId?: number
  sectionId?: number
  id: number
  status: ProgressStatus
  completedAt: string
}

export type StudentProgress = BaseProgress

export type StudentProgressQuery = {
  enrollmentId: number
  lessonId?: number
  sectionId?: number
} & SearchPaginatedRequestParams
