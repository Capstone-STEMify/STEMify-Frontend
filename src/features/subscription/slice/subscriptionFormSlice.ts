// this slice will be used to store the form data temporarily during the subscription creation process
// this slice stores: organizationId, contractId
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  organizationId: null as number | null,
  contractId: null as number | null
}

export const subscriptionFormSlice = createSlice({
  name: 'subscriptionForm',
  initialState,
  reducers: {
    setOrganizationId(state, action: { payload: number }) {
      state.organizationId = action.payload
    },
    setContractId(state, action: { payload: number }) {
      state.contractId = action.payload
    },
    resetSubscriptionForm(state) {
      state.organizationId = null
      state.contractId = null
    }
  }
})

export const { setOrganizationId, setContractId, resetSubscriptionForm } = subscriptionFormSlice.actions
export default subscriptionFormSlice.reducer
