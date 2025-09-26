import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PanelKey } from '@/features/resource/content/components/sidebar/panel/PanelContent'

interface TiptapState {
  activePanel: PanelKey | null
  assetId: number | null
}

const initialState: TiptapState = {
  activePanel: null,
  assetId: null
}

export const tiptapSlice = createSlice({
  name: 'tiptap',
  initialState,
  reducers: {
    setActivePanel: (state, action: PayloadAction<{ panel: PanelKey; assetId?: number }>) => {
      state.activePanel = action.payload.panel
      state.assetId = action.payload.assetId ?? null
    },
    resetPanel: (state) => {
      state.activePanel = null
      state.assetId = null
    }
  }
})

export const { setActivePanel, resetPanel } = tiptapSlice.actions
export default tiptapSlice.reducer
