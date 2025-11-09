import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedOrganizationState {
  selectedOrganizationId: number | null
}

const initialState: SelectedOrganizationState = {
  selectedOrganizationId: null
}

const selectedOrganizationSlice = createSlice({
  name: 'selectedOrganization',
  initialState,
  reducers: {
    setSelectedOrganizationId: (state, action: PayloadAction<number>) => {
      state.selectedOrganizationId = action.payload
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganizationId = null
    }
  }
})

export const { setSelectedOrganizationId, clearSelectedOrganization } = selectedOrganizationSlice.actions

export default selectedOrganizationSlice.reducer
