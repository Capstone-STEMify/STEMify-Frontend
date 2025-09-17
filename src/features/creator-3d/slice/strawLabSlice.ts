import { createSlice } from '@reduxjs/toolkit'

const initialStrawLabState = {
  cameraStatus: false
}

export const strawLabSlice = createSlice({
  name: 'strawLab',
  initialState: initialStrawLabState,
  reducers: {
    setCameraStatus(state, action) {
      state.cameraStatus = action.payload
    }
  }
})

export const { setCameraStatus } = strawLabSlice.actions
