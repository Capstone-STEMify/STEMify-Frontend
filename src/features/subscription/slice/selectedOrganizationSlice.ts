import { LicenseType, UserRole } from '@/types/userRole'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedOrganizationState {
  selectedOrganizationId: number | null
  selectedOrgUserId?: string | null
  selectedSubscriptionOrderId?: number | null
  currentRole?: LicenseType | UserRole.ADMIN | UserRole.STAFF | UserRole.GUEST
}

const initialState: SelectedOrganizationState = {
  selectedOrganizationId: null,
  selectedOrgUserId: null,
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
    setSelectedOrgUserId: (state, action: PayloadAction<string>) => {
      state.selectedOrgUserId = action.payload
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

export const {
  setSelectedOrganizationId,
  setSelectedOrgUserId,
  setSelectedSubscriptionOrderId,
  setCurrentRole,
  clearSelectedOrganization
} = selectedOrganizationSlice.actions

export default selectedOrganizationSlice.reducer
