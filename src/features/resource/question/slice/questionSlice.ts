'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Question } from '@/features/resource/question/types/question.type'

interface QuestionState {
  byQuizId: Record<number, Question[]>
  selectedQuestionId: number | null
}

const initialState: QuestionState = {
  byQuizId: {},
  selectedQuestionId: null
}

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<{ quizId: number; questions: Question[] }>) => {
      const { quizId, questions } = action.payload
      state.byQuizId[quizId] = questions
    },
    addQuestion: (state, action: PayloadAction<{ quizId: number; question: Question }>) => {
      const { quizId, question } = action.payload
      state.byQuizId[quizId] = [...(state.byQuizId[quizId] || []), question]
    },
    updateQuestion: (state, action: PayloadAction<{ quizId: number; id: number; updates: Partial<Question> }>) => {
      const { quizId, id, updates } = action.payload
      const list = state.byQuizId[quizId]
      if (!list) return
      const index = list.findIndex((q) => q.id === id)
      if (index !== -1) Object.assign(list[index], updates)
    },
    deleteQuestion: (state, action: PayloadAction<{ quizId: number; id: number }>) => {
      const { quizId, id } = action.payload
      state.byQuizId[quizId] = (state.byQuizId[quizId] || []).filter((q) => q.id !== id)
    },
    reorderQuestions: (state, action: PayloadAction<{ quizId: number; questions: Question[] }>) => {
      const { quizId, questions } = action.payload
      state.byQuizId[quizId] = questions
    },
    selectQuestion: (state, action: PayloadAction<number | null>) => {
      state.selectedQuestionId = action.payload
    },
    clearQuestions: (state) => {
      state.byQuizId = {}
      state.selectedQuestionId = null
    }
  }
})

export const {
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  selectQuestion,
  clearQuestions
} = questionSlice.actions

export default questionSlice.reducer
