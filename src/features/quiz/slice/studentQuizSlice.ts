import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'

interface QuizState {
  selectedQuiz: QuizStatistics | null
}

const initialState: QuizState = {
  selectedQuiz: null
}

export const quizSelectedSlice = createSlice({
  name: 'quizSelected',
  initialState,
  reducers: {
    setSelectedQuiz: (state, action: PayloadAction<QuizStatistics>) => {
      state.selectedQuiz = action.payload
    },
    clearSelectedQuiz: (state) => {
      state.selectedQuiz = null
    }
  }
})

export const { setSelectedQuiz, clearSelectedQuiz } = quizSelectedSlice.actions
export default quizSelectedSlice.reducer
