import { ClassroomSliceParams, ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'
import { createSlice } from '@reduxjs/toolkit'

const initialState: ClassroomSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  status: undefined
}

export const classroomSlice = createQuerySlice('classroomSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  classroomSlice.actions

// =======================================
// Create Classroom Slice

type CreateClassroomSlice = {
  // Legacy global selection (kept for backward compatibility)
  selectedStudentIds: string[]
  // New: per-group selected students mapping
  selectedStudentsByGroup: Record<number, string[]>
}

const initialCreateClassroomState: CreateClassroomSlice = {
  selectedStudentIds: [],
  selectedStudentsByGroup: {}
}

export const createClassroomSlice = createSlice({
  name: 'createClassroomSlice',
  initialState: initialCreateClassroomState,
  reducers: {
    setSelectedStudentIds(state, action) {
      state.selectedStudentIds = action.payload
    },
    setSelectedStudentsForGroup(state, action: { payload: { groupId: number; studentIds: string[] } }) {
      const { groupId, studentIds } = action.payload
      state.selectedStudentsByGroup[groupId] = studentIds
      // Also update legacy field to the most recent selection for compatibility
      state.selectedStudentIds = studentIds
    },
    clearCreateClassroomState: () => initialCreateClassroomState
  }
})

export const { setSelectedStudentIds, setSelectedStudentsForGroup, clearCreateClassroomState } =
  createClassroomSlice.actions
