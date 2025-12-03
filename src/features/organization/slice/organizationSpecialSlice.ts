import { createSlice } from '@reduxjs/toolkit'

type OrganizationSpecialState = {
  courseId: number | null
}

const initialState: OrganizationSpecialState = {
  courseId: null
}

export const organizationSpecialSlice = createSlice({
  name: 'organizationSpecial',
  initialState,
  reducers: {
    setCourseId(state, action) {
      state.courseId = action.payload
    }
  }
})

export const { setCourseId } = organizationSpecialSlice.actions
