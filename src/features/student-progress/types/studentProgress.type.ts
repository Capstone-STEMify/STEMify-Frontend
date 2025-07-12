export type LessonProgress = {
  id: number
  lessonId: number
  status: LessonProgressStatus
  completedAt: string
}

export enum LessonProgressStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed'
}
export enum SectionPregressStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed'
}

export type SectionProgress = {
  id: number
  sectionId: number
  status: LessonProgressStatus
  completedAt: string
}
