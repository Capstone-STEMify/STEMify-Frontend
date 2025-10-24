import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Question, Answer } from '@/features/resource/question/types/question.type'

interface QuestionState {
  questions: Question[]
  selectedQuestionId: number | null
}

const initialState: QuestionState = {
  questions: [],
  selectedQuestionId: null
}

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    selectQuestion: (state, action: PayloadAction<number | null>) => {
      state.selectedQuestionId = action.payload
    },

    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      const nextOrder = state.questions.length + 1
      state.questions.push({ ...action.payload, orderIndex: nextOrder })
    },

    updateQuestion: (state, action: PayloadAction<{ id: number; updates: Partial<Question> }>) => {
      const { id, updates } = action.payload
      const index = state.questions.findIndex((q) => q.id === id)
      if (index !== -1) {
        state.questions[index] = { ...state.questions[index], ...updates }
      }
    },

    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload)
      if (state.selectedQuestionId === action.payload) {
        state.selectedQuestionId = state.questions.length > 0 ? state.questions[0].id : null
      }
    },

    // 👉 Reorder danh sách câu hỏi
    reorderQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload.map((q, i) => ({ ...q, orderIndex: i + 1 }))
    }
  }
})

export const { selectQuestion, setQuestions, addQuestion, updateQuestion, deleteQuestion, reorderQuestions } =
  questionSlice.actions

export default questionSlice.reducer
