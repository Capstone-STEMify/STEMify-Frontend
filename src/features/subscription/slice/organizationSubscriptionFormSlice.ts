import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Step = 1 | 2

type OrganizationSubscriptionFormState = {
  currentStep: Step
  loading: boolean
  organizationId?: number
  contractId?: number
  organizationSubscriptionId?: string | number
}

const initialState: OrganizationSubscriptionFormState = {
  currentStep: 1,
  loading: false,
  organizationId: undefined,
  contractId: undefined,
  organizationSubscriptionId: undefined
}

export const organizationSubscriptionFormSlice = createSlice({
  name: 'organizationSubscriptionForm',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<Step>) => {
      state.currentStep = action.payload
    },
    goNext: (state) => {
      state.currentStep = Math.min(state.currentStep + 1, 4) as Step
    },
    goBack: (state) => {
      state.currentStep = Math.max(state.currentStep - 1, 1) as Step
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setOrganizationId: (state, action: PayloadAction<number | undefined>) => {
      state.organizationId = action.payload
    },
    setContractId: (state, action: PayloadAction<number | undefined>) => {
      state.contractId = action.payload
    },
    setOrganizationSubscriptionId: (state, action: PayloadAction<number | undefined>) => {
      state.organizationSubscriptionId = action.payload
    },
    resetForm: () => initialState
  }
})

export const {
  setCurrentStep,
  goNext,
  goBack,
  setLoading,
  setOrganizationId,
  setContractId,
  setOrganizationSubscriptionId,
  resetForm
} = organizationSubscriptionFormSlice.actions

export default organizationSubscriptionFormSlice.reducer
