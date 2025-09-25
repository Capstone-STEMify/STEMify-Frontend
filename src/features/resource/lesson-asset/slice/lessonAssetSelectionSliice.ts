import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LessonAssetSelectionState {
  selectedIds: number[]
}

const initialState: LessonAssetSelectionState = {
  selectedIds: []
}

export const lessonAssetSelectionSlice = createSlice({
  name: 'lessonAssetSelection',
  initialState,
  reducers: {
    toggleSelect(state, action: PayloadAction<number>) {
      const id = action.payload
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id)
      } else {
        state.selectedIds.push(id)
      }
    },
    clearSelection(state) {
      state.selectedIds = []
    },
    setSelection(state, action: PayloadAction<number[]>) {
      state.selectedIds = action.payload
    }
  }
})

export const { toggleSelect, clearSelection, setSelection } = lessonAssetSelectionSlice.actions
export default lessonAssetSelectionSlice.reducer
