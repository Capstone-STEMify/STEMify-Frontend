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
    }
  }
})

export const { triggerSave } = editorSlice.actions
export default editorSlice.reducer
