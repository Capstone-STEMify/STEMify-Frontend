import { Question } from '@/features/resource/question/types/question.type'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Quiz = {
  id: number
  title: string
  description: string
  totalMarks: number
  passingMarks: number
  durationDays: number
  status: string
  contentId: number
  timeLimitMinutes: number
  totalQuestions: number
  questions: Question[]
}

export type QuizQueryParams = {
  sectionId?: number
} & SearchPaginatedRequestParams
