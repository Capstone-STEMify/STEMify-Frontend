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

export type QuizAttempt = {
  id: number
  quizId: number
  studentId: number
  status: QuizAttemptStatus
  assignedAt: string
  dueDate: string
  attemptCount: number
  attempts: Attempt[]
}

export type Attempt = {
  id: number
  studentQuizId: number
  startedAt: string
  totalScore: number
  status: string
  attemptNumber: number
  questionAttempts: any[]
}

export enum QuizAttemptStatus {
  IN_PROGRESS = 'InProgress',
  PASSED = 'Passed',
  FAILED = 'Failed'
}
