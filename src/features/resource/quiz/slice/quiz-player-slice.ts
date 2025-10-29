import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockQuiz } from '@/features/resource/quiz/data/mock-data'
import { Question } from '@/features/resource/question/types/question.type'

interface QuizPlayerState {
  questions: Question[]
  currentQuestionIndex: number
  timeRemaining: number
  isSubmitted: boolean
  userAnswers: Record<number, string | number>
}

const initialState: QuizPlayerState = {
  questions: mockQuiz.questions,
  currentQuestionIndex: 0,
  timeRemaining: mockQuiz.duration * 60,
  isSubmitted: false,
  userAnswers: {}
}

export const quizPlayerSlice = createSlice({
  name: 'quizPlayer',
  initialState,
  reducers: {
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload
    },
    setUserAnswer: (state, action: PayloadAction<{ questionId: number; answer: string | number }>) => {
      state.userAnswers[action.payload.questionId] = action.payload.answer
    },
    goToNextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
      }
    },
    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
      }
    },
    submitQuiz: (state) => {
      state.isSubmitted = true
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1
      } else if (state.timeRemaining === 0 && !state.isSubmitted) {
        state.isSubmitted = true
      }
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0
      state.timeRemaining = mockQuiz.duration * 60
      state.isSubmitted = false
      state.userAnswers = {}
    }
  }
})

export const {
  setCurrentQuestionIndex,
  setUserAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  submitQuiz,
  decrementTime,
  resetQuiz
} = quizPlayerSlice.actions

export default quizPlayerSlice.reducer
