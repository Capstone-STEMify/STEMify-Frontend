export type Assignment = {
  id: number
  contentId: number
  totalScore: number
  passingScore: number
  allowResubmission: string
  dueDate: string
}

export type AssignmentQuestion = {
  id: number
  assignmentId: number
  type: AssignmentQuestionType
  prompt: string
  orderIndex: number
  maxScore: number
}

export enum AssignmentQuestionType {
  TEXT = 'Text',
  FILE = 'File'
}

export enum AssignmentSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded'
}

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
