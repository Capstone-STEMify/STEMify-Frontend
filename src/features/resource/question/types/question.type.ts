export type Question = {
  id: number
  questionType: string
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
