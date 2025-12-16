import { createSlice } from '@reduxjs/toolkit'

type OrganizationSpecialState = {
  courseId: number | null
  courseTitle?: string
  isRefetchOrganization?: boolean
}

const initialState: OrganizationSpecialState = {
  courseId: null,
  courseTitle: undefined,
  isRefetchOrganization: false
}

export const organizationSpecialSlice = createSlice({
  name: 'organizationSpecial',
  initialState,
  reducers: {
    setCourseId(state, action) {
      state.courseId = action.payload
    },
    setCourseTitle(state, action) {
      state.courseTitle = action.payload
    },

    triggerRefetchOrganization(state) {
      state.isRefetchOrganization = true
    },
    clearRefetchOrganization(state) {
      state.isRefetchOrganization = false
    }
  }
})

export const { setCourseId, setCourseTitle, triggerRefetchOrganization, clearRefetchOrganization } =
  organizationSpecialSlice.actions
