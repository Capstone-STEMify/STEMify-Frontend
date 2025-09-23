import { createSlice } from '@reduxjs/toolkit'

type EditorState = {
  saveTrigger: number
}

const initialState: EditorState = {
  saveTrigger: 0
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    triggerSave(state) {
      state.saveTrigger += 1
    }
  }
})

export const { triggerSave } = editorSlice.actions
export default editorSlice.reducer
