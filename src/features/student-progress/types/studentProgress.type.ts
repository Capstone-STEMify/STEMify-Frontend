import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum ProgressStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed'
}

export type ProgressType = 'lesson' | 'section'

export type BaseProgress = {
  id: number
  status: ProgressStatus
  completedAt: string
}

export type LessonProgress = {
  lessonId: number
} & BaseProgress

export type SectionProgress = {
  sectionId: number
} & BaseProgress

export type StudentProgress = LessonProgress | SectionProgress

export type StudentProgressQuery = {
  enrollmentId: number
  lessonId?: number
  sectionId?: number
} & SearchPaginatedRequestParams
