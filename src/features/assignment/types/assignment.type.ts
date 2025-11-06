// assigment
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

// assignment attempt
export type StudentAssignment = {
  id: number
  assignmentId: number
  studentId: number
  studentSectionProgressId: number
  assignedAt: string
  finalScore: number | null
  dueDate: string
  attemptCount: number
  maxAttemptAllowed: number
  status: string
}

export type AssignmentAttempt = {
  id: number
  studentAssignmentId: number
  teacherId: string
  submittedAt: string | null
  totalScore: number | null
  feedback: string | null
  attemptNumber: number
  status: string
}

export type AssignmentQuestionAttempt = {
  id: number
  assignmentAttemptId: number
  assignmentQuestionId: number
  answerText: string | null
  answerFileUrl: string | null
  points: number | null
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
// =================== draft submission ==============

// Rubric
export type RubricCriterion = {
  id: number
  assignmentQuestionId: number
  criterionName: string
  maxPoints: number
}

export type RubricScore = {
  id: number
  assignmentQuestionAttemptId: number
  rubricCriterionId: number
  points: number
}
