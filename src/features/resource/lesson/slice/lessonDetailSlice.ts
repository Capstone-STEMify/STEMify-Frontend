import { createSlice } from '@reduxjs/toolkit'

type LessonDetailSlice = {
  mode?: 'normal' | 'quiz'
  selectedSectionId?: number
  quizId?: number
  isPrintModalOpen?: boolean
}

const initialState: LessonDetailSlice = {
  mode: 'normal',
  selectedSectionId: undefined,
  quizId: undefined,
  isPrintModalOpen: false
}

export const lessonDetailSlice = createSlice({
  name: 'lessonDetail',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload
    },
    setSelectedSectionId: (state, action) => {
      state.selectedSectionId = action.payload
    },
    setQuizId: (state, action) => {
      state.quizId = action.payload
    },
    setIsPrintModalOpen: (state, action) => {
      state.isPrintModalOpen = action.payload
    },
    clearLesson: (state) => {
      state.mode = 'normal'
      state.selectedSectionId = undefined
      state.quizId = undefined
      state.isPrintModalOpen = false
    }
  }
})

export const { setMode, setQuizId, setSelectedSectionId, setIsPrintModalOpen, clearLesson } = lessonDetailSlice.actions
export default lessonDetailSlice.reducer
