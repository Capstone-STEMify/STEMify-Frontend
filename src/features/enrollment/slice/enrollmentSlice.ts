import { createSlice } from '@reduxjs/toolkit'

type EnrollmentState = {
  courseEnrollmentId: number | null
  curriculumEnrollmentId: number | null
}

const intinialState: EnrollmentState = {
  courseEnrollmentId: null,
  curriculumEnrollmentId: null
}
export const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: intinialState,
  reducers: {
    setCourseEnrollmentId: (state, action) => {
      state.courseEnrollmentId = action.payload
    },
    setCurriculumEnrollmentId: (state, action) => {
      state.curriculumEnrollmentId = action.payload
    }
  }
})

export const { setCourseEnrollmentId, setCurriculumEnrollmentId } = enrollmentSlice.actions
