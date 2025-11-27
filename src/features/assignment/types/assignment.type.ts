import { SearchPaginatedRequestParams } from '@/types/baseModel'

// =================== Assignment Types ===================
export type Assignment = {
  id: number
  contentId: number
  title: string
  totalScore: number
  passingScore: number
  durationDays: number
  cooldownHours: number
  questions: AssignmentQuestion[]
}

export enum AssignmentQuestionType {
  TEXT = 'Text',
  FILE = 'FileUpload'
}

export type RubricCriterion = {
  id: number
  assignmentQuestionId: number
  criterionName: string
  maxPoints: number
}

export type AssignmentQuestion = {
  id: number
  type: AssignmentQuestionType
  orderIndex: number
  points: number
  content: string
  rubricCriterion: RubricCriterion[]
}

// =================== Create/Update DTOs ===================
// Used for API requests (no IDs)
export type CreateAssignmentDto = {
  sectionId: number
  title: string
  passingScore: number
  durationDays: number
  cooldownHours: number
  questions: CreateAssignmentQuestionDto[]
}

export type CreateAssignmentQuestionDto = {
  type: AssignmentQuestionType
  orderIndex: number
  points: number
  content: string
  rubricCriterion: CreateRubricCriterionDto[]
}

export type CreateRubricCriterionDto = {
  criterionName: string
  maxPoints: number
}

// ================== Update DTOs ===================
export type UpdateAssignmentDto = {
  contentId: number
  title: string
  passingScore: number
  durationDays: number
  questions: UpdateAssignmentQuestionDto[]
}

export type UpdateAssignmentQuestionDto = {
  id?: number
  type: string
  orderIndex: number
  points: number
  content: string
}

// =================== Submission Types ===================
export enum AssignmentSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded'
}

export type AssignmentSubmission = {
  id: number
  assignmentId: number
  studentId: string
  gradedBy: number
  submittedAt: string
  totalScore: number
  feedback: string
  attemptNumber: number
  status: AssignmentSubmissionStatus
  isPass: boolean
  answers: SubmissionAnswer[]
}

export type SubmissionAnswer = {
  id: number
  submissionId: number
  assignmentQuestionId: number
  answerText: string
  answerFileUrl: string
  feedback: string
  score: number
}

// =================== Query Params ===================
export type AssignmentQueryParams = {} & SearchPaginatedRequestParams

// =================== CSV Import/Export Types ===================
export type AssignmentImportResponse = {
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
