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
  maxAttempt?: number
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
  finalScore: number
  assignedAt: string
  dueDate: string
  maxAttemptAllowed: number
  attemptCount: number
  attempts: Attempt[]
}

export type Attempt = {
  id: number
  studentQuizId: number
  startedAt: string
  completedAt: string
  totalScore: number
  status: QuizAttemptStatus
  attemptNumber: number
  questionAttempts: QuestionAttemptResponse[]
}

export type QuestionAttemptResponse = {
  questionId: number
  isCorrect: boolean
  score: number
  answerAttempts: AnswerAttempt[]
}

export type AnswerAttempt = {
  answerId: number
  isSelected: boolean
  isCorrect: boolean
}

export enum QuizAttemptStatus {
  IN_PROGRESS = 'InProgress',
  PASSED = 'Passed',
  FAILED = 'Failed'
}

export type QuestionAttemptQuery = {
  questionId: number
  answerIds: number[]
}

export type QuizImportResponse = {
  totalRows: number
  successCount: number
  failureCount: number
  errors: {
    rowNumber: number
    field: string
    errorMessage: string
    rowData: string
  }[]
}

export type StudentQuizAttemptResponse = {
  id: number
  studentQuizId: number
  startedAt: string
  totalScore: number
  status: QuizAttemptStatus
  attemptNumber: number
  questionAttempts: []
}
