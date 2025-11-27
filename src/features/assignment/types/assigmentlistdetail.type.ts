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
  lastSubmittedAt: string
  attempts: AssignmentAttempt[]
}

export type AssignmentAttempt = {
  id: number
  studentAssignmentId: number
  teacherId: string
  submittedAt: string
  totalScore: number
  status: 'UnderReview' | 'Graded' | 'Draft' | 'Submitted' | string
  feedback: string
  attemptNumber: number
  questionAttempts: QuestionAttempt[]
}

export type StudentAssignmentDetail = {
  id: number
  assignmentId: number
  studentId: string
  finalScore?: number
  status: StudentAssignmentStatus
  nextAttemptAvailableAt?: string 
  assignedAt: string
  dueDate: string
  maxAttemptAllowed: number
  attemptCount: number
  attempts: AssignmentAttempt[]
}

export enum StudentAssignmentStatus {
  SUBMITTED = 'Submitted',
  PASSED = 'Passed',
  FAILED = 'Failed',
  EXPIRED = 'Expired',
  ASSIGNED = 'Assigned',
  UNDER_REVIEW = 'UnderReview'
}

export type QuestionAttempt = {
  id: number
  assignmentAttemptId: number
  assignmentQuestionId: number
  answerText: string
  answerFileUrl: string
  points: number
  rubricScore: RubricCriterion[]
}

export type RubricCriterion = {
  rubricCriterionId: number
  criterionName: string
  maxPoints: number
  currentPoints?: number
}

export type StudentAssignmentQueryParam = {
  classroomId: number
} & SearchPaginatedRequestParams

export type RubricScorePayload = {
  rubricCriterionId: number
  points: number
}

export type QuestionGradePayload = {
  assignmentQuestionAttemptId: number
  rubricScores: RubricScorePayload[]
}

export type GradeSubmissionPayload = {
  feedback: string
  questionGrades: QuestionGradePayload[]
}

export type QuestionAttemptPayload = {
  assignmentQuestionId: number
  answerText?: string
  answerFile?: string
}

export type CreateAttemptPayload = {
  studentAssignmentId: number
  questionAttempts: QuestionAttemptPayload[]
}
