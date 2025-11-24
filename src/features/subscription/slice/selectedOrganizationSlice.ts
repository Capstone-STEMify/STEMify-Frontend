import { LicenseType, UserRole } from '@/types/userRole'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedOrganizationState {
  selectedOrganizationId: number | null
  selectedSubscriptionOrderId?: number | null
  currentRole?: LicenseType | UserRole.ADMIN | UserRole.STAFF | UserRole.GUEST
}

const initialState: SelectedOrganizationState = {
  selectedOrganizationId: null,
  selectedSubscriptionOrderId: null,
  currentRole: UserRole.GUEST
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
    setCurrentRole: (state, action: PayloadAction<LicenseType | UserRole.ADMIN | UserRole.STAFF>) => {
      state.currentRole = action.payload
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganizationId = null
      state.selectedSubscriptionOrderId = null
      state.currentRole = UserRole.GUEST
    }
  }
})

export const { setSelectedOrganizationId, setSelectedSubscriptionOrderId, setCurrentRole, clearSelectedOrganization } =
  selectedOrganizationSlice.actions

export default selectedOrganizationSlice.reducer
