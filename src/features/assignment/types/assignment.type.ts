// assigment
export type Assignment = {
  id: number
  contentId: number
  title: string
  totalScore: number
  passingScore: number
  durationDays: number
  questions: AssignmentQuestion[]
}

export enum AssignmentQuestionType {
  TEXT = 'Text',
  FILE = 'File'
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

export enum AssignmentSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded'
}

// =================== draft submission ==============
export type AssignmentSubmission = {
  id: number
  assignmentId: number
  studentId: number
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
