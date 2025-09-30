import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AssemblyState {
  mode: 'player' | 'builder'
  assemblyUrl?: string | null
  isShiftPressed: boolean
  isTransforming: boolean
  currentStepId?: string | null
}

const initialState: AssemblyState = {
  mode: 'player',
  assemblyUrl: null,
  isShiftPressed: false,
  isTransforming: false,
  currentStepId: null
}

export const assemblySlice = createSlice({
  name: 'assembly',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'player' | 'builder'>) => {
      state.mode = action.payload
    },
    setAssemblyUrl: (state, action: PayloadAction<string | null>) => {
      state.assemblyUrl = action.payload
    },
    setIsShiftPressed: (state, action: PayloadAction<boolean>) => {
      state.isShiftPressed = action.payload
    },
    setIsTransforming: (state, action: PayloadAction<boolean>) => {
      state.isTransforming = action.payload
    },
    setCurrentStepId: (state, action: PayloadAction<string | null>) => {
      state.currentStepId = action.payload
    },
    resetAssembly: () => initialState
  }
})

export const { setMode, setAssemblyUrl, setIsShiftPressed, setIsTransforming, setCurrentStepId, resetAssembly } =
  assemblySlice.actions

export default assemblySlice.reducer
