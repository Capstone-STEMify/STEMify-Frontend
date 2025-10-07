import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SelectionType = 'component' | 'action' | null

interface SelectionState {
  type: SelectionType
  id: string | null
}

const initialState: SelectionState = {
  type: null,
  id: null
}

export const selectionObjectSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectComponent: (state, action: PayloadAction<string>) => {
      state.type = 'component'
      state.id = action.payload
    },
    selectAction: (state, action: PayloadAction<string>) => {
      state.type = 'action'
      state.id = action.payload
    },
    clearSelection: (state) => {
      state.type = null
      state.id = null
    }
  }
})

export const { selectComponent, selectAction, clearSelection } = selectionObjectSlice.actions
export default selectionObjectSlice.reducer
