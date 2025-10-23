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
    // 👉 Chọn câu hỏi
    selectQuestion: (state, action: PayloadAction<number | null>) => {
      state.selectedQuestionId = action.payload
    },

    // 👉 Thêm câu hỏi mới
    addQuestion: (state, action: PayloadAction<Question>) => {
      const nextOrder = state.questions.length + 1
      state.questions.push({ ...action.payload, orderIndex: nextOrder })
    },

    // 👉 Cập nhật câu hỏi
    updateQuestion: (state, action: PayloadAction<{ id: number; updates: Partial<Question> }>) => {
      const { id, updates } = action.payload
      const index = state.questions.findIndex((q) => q.id === id)
      if (index !== -1) {
        state.questions[index] = { ...state.questions[index], ...updates }
      }
    },

    // 👉 Xóa câu hỏi
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload)
      if (state.selectedQuestionId === action.payload) {
        state.selectedQuestionId = state.questions.length > 0 ? state.questions[0].id : null
      }
    },

    // 👉 Reorder danh sách câu hỏi
    reorderQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload.map((q, i) => ({ ...q, orderIndex: i + 1 }))
    },

    // 👉 Thêm câu trả lời
    addAnswer: (state, action: PayloadAction<{ questionId: number; answer: Answer }>) => {
      const q = state.questions.find((x) => x.id === action.payload.questionId)
      if (q) q.answers = [...q.answers, action.payload.answer]
    },

    // 👉 Xóa câu trả lời
    deleteAnswer: (state, action: PayloadAction<{ questionId: number; answerId: number }>) => {
      const q = state.questions.find((x) => x.id === action.payload.questionId)
      if (q) q.answers = q.answers.filter((a) => a.id !== action.payload.answerId)
    },

    // 👉 Reorder câu trả lời
    reorderAnswers: (state, action: PayloadAction<{ questionId: number; newOrder: Answer[] }>) => {
      const q = state.questions.find((x) => x.id === action.payload.questionId)
      if (q) q.answers = [...action.payload.newOrder]
    }
  }
})

export const {
  selectQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  addAnswer,
  deleteAnswer,
  reorderAnswers
} = questionSlice.actions

export default questionSlice.reducer
