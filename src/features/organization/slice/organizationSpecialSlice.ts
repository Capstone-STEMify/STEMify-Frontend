import { createSlice } from '@reduxjs/toolkit'

type OrganizationSpecialState = {
  courseId: number | null
  isRefetchOrganization?: boolean
}

const initialState: OrganizationSpecialState = {
  courseId: null,
  isRefetchOrganization: false
}

export const organizationSpecialSlice = createSlice({
  name: 'organizationSpecial',
  initialState,
  reducers: {
    setCourseId(state, action) {
      state.courseId = action.payload
    },

    triggerRefetchOrganization(state) {
      state.isRefetchOrganization = true
    },
    clearRefetchOrganization(state) {
      state.isRefetchOrganization = false
    }
  }
})

export const { setCourseId, triggerRefetchOrganization, clearRefetchOrganization } = organizationSpecialSlice.actions
