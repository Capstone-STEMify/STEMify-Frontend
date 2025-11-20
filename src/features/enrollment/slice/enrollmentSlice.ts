import { createSlice } from '@reduxjs/toolkit'

type EnrollmentState = {
  courseEnrollmentId: number | null
}

const intinialState: EnrollmentState = {
  courseEnrollmentId: null
}
export const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: intinialState,
  reducers: {
    setCourseEnrollmentId: (state, action) => {
      state.courseEnrollmentId = action.payload
    }
  }
})

export const { setCourseEnrollmentId } = enrollmentSlice.actions
