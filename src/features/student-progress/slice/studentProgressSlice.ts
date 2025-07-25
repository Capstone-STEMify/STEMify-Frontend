import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProgressStatus } from '../types/studentProgress.type'

type studentProgressState = {
  selectedEnrollmentId?: number
  selectedLessonId?: number
  selectedStatus?: ProgressStatus
}

const initialState: studentProgressState = {
  selectedEnrollmentId: undefined,
  selectedLessonId: undefined,
  selectedStatus: undefined
}

export const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState,
  reducers: {
    setSelectedEnrollmentId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedEnrollmentId = action.payload
    },
    setSelectedLessonId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedLessonId = action.payload
    },
    setSelectedStatus: (state, action: PayloadAction<ProgressStatus | undefined>) => {
      state.selectedStatus = action.payload
    }
  }
})

export const { setSelectedEnrollmentId, setSelectedLessonId, setSelectedStatus } = studentProgressSlice.actions
export const studentProgressReducer = studentProgressSlice.reducer
