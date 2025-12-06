import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProgressStatus } from '../types/studentProgress.type'

type studentProgressState = {
  selectedEnrollmentId?: number
  selectedLessonId?: number
  selectedLessonStatus?: ProgressStatus
  selectedSectionId?: number
  selectedSectionStatus?: ProgressStatus
  shouldRefetchSectionProgress: boolean
}

const initialState: studentProgressState = {
  selectedEnrollmentId: undefined,
  selectedLessonId: undefined,
  selectedLessonStatus: undefined,
  selectedSectionId: undefined,
  selectedSectionStatus: undefined,
  shouldRefetchSectionProgress: false
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
    setSelectedLessonStatus: (state, action: PayloadAction<ProgressStatus | undefined>) => {
      state.selectedLessonStatus = action.payload
    },
    setSelectedSectionId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedSectionId = action.payload
    },
    setSelectedSectionStatus: (state, action: PayloadAction<ProgressStatus | undefined>) => {
      state.selectedSectionStatus = action.payload
    },

    triggerRefetchSectionProgress(state) {
      state.shouldRefetchSectionProgress = true
    },
    clearRefetchSectionProgress(state) {
      state.shouldRefetchSectionProgress = false
    }
  }
})

export const {
  setSelectedEnrollmentId,
  setSelectedLessonId,
  setSelectedLessonStatus,
  setSelectedSectionId,
  setSelectedSectionStatus,
  triggerRefetchSectionProgress,
  clearRefetchSectionProgress
} = studentProgressSlice.actions
export const studentProgressReducer = studentProgressSlice.reducer
