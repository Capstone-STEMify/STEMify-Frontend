import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type AssignmentStatistics = {
  assignmentId: number
  assignmentTitle: string
  submissions: number
  averageScore: number
  passRate: number
  totalQuestions: number
  studentStatistics: StudentStatistic[]
}

export type StudentStatistic = {
  studentId: string
  studentName: string
  imageUrl: string
  status: 'Submitted' | 'Pending' | 'UnderReview' | 'Graded' | string
  lastSubmittedAt: string // ISO 8601 date string
  attempts: AssignmentAttempt[]
}

export type AssignmentAttempt = {
  id: number
  studentAssignmentId: number
  teacherId: string
  submittedAt: string // ISO 8601 date string
  totalScore: number
  status: 'UnderReview' | 'Graded' | 'Draft' | 'Submitted' | string
  feedback: string
  attemptNumber: number
  questionAttempts: []
}

export type StudentAssignmentQueryParam = {
  classroomId: number
} & SearchPaginatedRequestParams
