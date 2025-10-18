import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockQuiz } from '@/features/resource/quiz/data/mock-data'
import { Answer, Question, Quiz } from '@/features/resource/quiz/types/quiz.type'

interface QuizBuilderState {
  quiz: Quiz
  currentQuestionId: number | null
}

const initialState: QuizBuilderState = {
  quiz: mockQuiz,
  currentQuestionId: mockQuiz.questions[0]?.id || null
}

export const quizBuilderSlice = createSlice({
  name: 'quizBuilder',
  initialState,
  reducers: {
    setCurrentQuestionId: (state, action: PayloadAction<number | null>) => {
      state.currentQuestionId = action.payload
    },
    addQuestion: (state) => {
      const newId = Math.max(...state.quiz.questions.map((q) => q.id), 0) + 1
      const newQuestion: Question = {
        id: newId,
        quizId: state.quiz.id,
        questionTypeId: 2,
        name: '',
        point: 1,
        orderIndex: state.quiz.questions.length + 1,
        answers: []
      }
      state.quiz.questions.push(newQuestion)
      state.currentQuestionId = newId
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.quiz.questions = state.quiz.questions.filter((q) => q.id !== action.payload)
      if (state.currentQuestionId === action.payload) {
        state.currentQuestionId = state.quiz.questions[0]?.id || null
      }
    },
    updateQuestion: (state, action: PayloadAction<{ id: number; updates: Partial<Question> }>) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload.id)
      if (question) {
        Object.assign(question, action.payload.updates)
      }
    },
    updateQuiz: (state, action: PayloadAction<Partial<Quiz>>) => {
      Object.assign(state.quiz, action.payload)
    },
    addAnswer: (state, action: PayloadAction<{ questionId: number; answer: Answer }>) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload.questionId)
      if (question) {
        question.answers.push(action.payload.answer)
      }
    },
    deleteAnswer: (state, action: PayloadAction<{ questionId: number; answerId: number }>) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload.questionId)
      if (question) {
        question.answers = question.answers.filter((a) => a.id !== action.payload.answerId)
      }
    },
    updateAnswer: (
      state,
      action: PayloadAction<{ questionId: number; answerId: number; updates: Partial<Answer> }>
    ) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload.questionId)
      if (question) {
        const answer = question.answers.find((a) => a.id === action.payload.answerId)
        if (answer) {
          Object.assign(answer, action.payload.updates)
        }
      }
    }
  }
})

export const {
  setCurrentQuestionId,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  updateQuiz,
  addAnswer,
  deleteAnswer,
  updateAnswer
} = quizBuilderSlice.actions

export default quizBuilderSlice.reducer
