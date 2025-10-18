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
  sectionId?: number
  title: string
  description?: string
  duration: number
  createdBy: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived'
  passingScore: number
  questions: Question[]
}
