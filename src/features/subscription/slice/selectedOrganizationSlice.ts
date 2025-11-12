import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedOrganizationState {
  selectedOrganizationId: number | null
  selectedSubscriptionOrderId?: number | null
}

const initialState: SelectedOrganizationState = {
  selectedOrganizationId: null,
  selectedSubscriptionOrderId: null
}

const selectedOrganizationSlice = createSlice({
  name: 'selectedOrganization',
  initialState,
  reducers: {
    setSelectedOrganizationId: (state, action: PayloadAction<number>) => {
      state.selectedOrganizationId = action.payload
    },
    setSelectedSubscriptionOrderId: (state, action: PayloadAction<number>) => {
      state.selectedSubscriptionOrderId = action.payload
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganizationId = null
      state.selectedSubscriptionOrderId = null
    }
  }
})

export const { setSelectedOrganizationId, setSelectedSubscriptionOrderId, clearSelectedOrganization } =
  selectedOrganizationSlice.actions

export default selectedOrganizationSlice.reducer
