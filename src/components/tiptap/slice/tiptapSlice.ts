import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PanelKey } from '@/features/resource/content/components/sidebar/panel/PanelContent'

interface TiptapState {
  activePanel: PanelKey | null
}

const initialState: TiptapState = {
  activePanel: null
}

export const tiptapSlice = createSlice({
  name: 'tiptap',
  initialState,
  reducers: {
    setActivePanel: (state, action: PayloadAction<PanelKey | null>) => {
      state.activePanel = action.payload
    },
    resetPanel: (state) => {
      state.activePanel = null
    }
  }
})

export const { setActivePanel, resetPanel } = tiptapSlice.actions
export default tiptapSlice.reducer
