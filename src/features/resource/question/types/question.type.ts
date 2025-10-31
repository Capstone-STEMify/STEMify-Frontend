export type Question = {
  id: number | null
  key: number
  questionType: QuestionType
  content: string
  orderIndex: number
  answerExplanation: string
  points: number
  answers: Answer[]
}

export type Answer = {
  key: number
  id: number | null
  content: string
  isCorrect: boolean
}

export enum QuestionType {
  SINGLE_CHOICE = 'SingleChoice',
  MULTIPLE_CHOICE = 'MultipleChoice',
  TRUE_FALSE = 'TrueFalse'
}
