import { createSlice } from '@reduxjs/toolkit'

type EditorState = {
  saveTrigger: number | null
}

const initialState: EditorState = {
  saveTrigger: null
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    triggerSave(state) {
      state.saveTrigger = Date.now()
    },
    resetSaveTrigger(state) {
      state.saveTrigger = null
    }
  }
})

export const { triggerSave, resetSaveTrigger } = editorSlice.actions
export default editorSlice.reducer
