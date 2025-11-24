import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Assignment } from '@/features/assignment/types/assignment.type'
import { StudentAssignmentDetail } from '@/features/assignment/types/assigmentlistdetail.type'

interface StudentAssignmentState {
  selectedAssignment: Assignment | null
  selectedStudentAssignment?: StudentAssignmentDetail | null
}

const initialState: StudentAssignmentState = {
  selectedAssignment: null,
  selectedStudentAssignment: null
}

export const studentAssignmentSelectedSlice = createSlice({
  name: 'studentAssignmentSelected',
  initialState,
  reducers: {
    setSelectedAssignment: (state, action: PayloadAction<Assignment>) => {
      state.selectedAssignment = action.payload
    },
    setSelectedStudentAssignment: (state, action: PayloadAction<StudentAssignmentDetail>) => {
      state.selectedStudentAssignment = action.payload
    },
    clearStudentAssignment: (state) => {
      state.selectedAssignment = null
      state.selectedStudentAssignment = null
    }
  }
})

export const { setSelectedAssignment, setSelectedStudentAssignment, clearStudentAssignment } =
  studentAssignmentSelectedSlice.actions
export default studentAssignmentSelectedSlice.reducer
