export type Question = {
  id: number
  questionType: QuestionType
  content: string
  orderIndex: number
  answerExplanation: string
  points: number
  answers: Answer[]
}

export type Answer = {
  id: number
  content: string
  isCorrect: boolean
}

export enum QuestionType {
  SINGLE_CHOICE = 'SingleChoice',
  MULTIPLE_CHOICE = 'MultipleChoice',
  TRUE_FALSE = 'TrueFalse'
}
