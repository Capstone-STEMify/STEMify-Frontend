import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { Question } from '@/features/resource/question/types/question.type'

interface QuizPlayerState {
  studentQuizId?: number
  quizAttemptId?: number
  questions: Question[]
  currentQuestionIndex: number
  timeRemaining: number
  isSubmitted: boolean
  userAnswers: Record<number, (string | number)[]>
}

const initialState: QuizPlayerState = {
  studentQuizId: undefined,
  quizAttemptId: undefined,
  questions: [],
  currentQuestionIndex: 0,
  timeRemaining: 100 * 60,
  isSubmitted: false,
  userAnswers: {}
}

export const quizPlayerSlice = createSlice({
  name: 'quizPlayer',
  initialState,
  reducers: {
    setStudentQuizId: (state, action: PayloadAction<number>) => {
      state.studentQuizId = action.payload
    },
    setQuizAttemptId: (state, action: PayloadAction<number>) => {
      state.quizAttemptId = action.payload
    },
    initializeQuiz: (state, action: PayloadAction<{ questions: Question[]; timeLimitMinutes?: number }>) => {
      state.questions = action.payload.questions
      state.timeRemaining = (action.payload.timeLimitMinutes || 100) * 60
      state.currentQuestionIndex = 0
      state.isSubmitted = false
      state.userAnswers = {}
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload
    },
    setUserAnswer: (state, action: PayloadAction<{ questionId: number; answer: string | number }>) => {
      state.userAnswers[action.payload.questionId] = [action.payload.answer]
    },
    /** Multiple-choice toggle */
    toggleUserAnswer: (state, action: PayloadAction<{ questionId: number; answer: string | number }>) => {
      const { questionId, answer } = action.payload
      const prev = state.userAnswers[questionId] || []
      state.userAnswers[questionId] = prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
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
      state.timeRemaining = 100 * 60
      state.isSubmitted = false
      state.userAnswers = {}
    }
  }
})

export const {
  setStudentQuizId,
  setQuizAttemptId,
  initializeQuiz,
  setCurrentQuestionIndex,
  setUserAnswer,
  toggleUserAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  submitQuiz,
  decrementTime,
  resetQuiz
} = quizPlayerSlice.actions

export default quizPlayerSlice.reducer
