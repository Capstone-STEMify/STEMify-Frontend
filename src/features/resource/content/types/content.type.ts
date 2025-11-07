import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export enum ContentType {
  TEXT = 'Text',
  QUIZ = 'Quiz',
  ASSIGNMENT = 'Assignment'
}

export type BaseContent = {
  id: number
  contentType: ContentType
  contentBody: string
  fileName?: string
  fileUrl?: string
  uploadDate?: string
  status: string
  sectionId: number
}

export type TextContent = BaseContent & {
  contentType: ContentType.TEXT
}

export type QuizContent = BaseContent & {
  contentType: ContentType.QUIZ
  quizTitle: string
  quizDescription: string
  totalMarks: number
  passingMarks: number
  timeLimitInMinutes: number
  quizId: number
}

export type AssignmentContent = BaseContent & {
  totalMarks: number
  passingMarks: number
  durationDays: number
  assignmentId: number
  assignmentTitle: string
}

export type Content = TextContent | QuizContent | AssignmentContent

export type ContentQueryParams = {
  contentType?: ContentType
  sectionId?: number
} & SearchPaginatedRequestParams

export type ContentSliceParams = {
  contentType?: ContentType
  sectionId?: number
} & SliceQueryParams
