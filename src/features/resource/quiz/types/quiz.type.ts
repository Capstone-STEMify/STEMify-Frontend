import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Answer = {
  id: number
  questionId: number
  content: string
  isCorrect: boolean
}

export type Question = {
  id: number
  quizId: number
  questionTypeId: number
  name: string
  fileUrl?: string
  description?: string
  answerExplanation?: string
  point: number
  orderIndex: number
  answers: Answer[]
}

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

export type QuizQueryParams = {} & SearchPaginatedRequestParams
