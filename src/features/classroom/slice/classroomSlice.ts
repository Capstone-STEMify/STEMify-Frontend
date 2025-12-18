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
  missMatchActionByGroup: Record<number, 'autoAssign' | 'exclude'>
  selectedStudentsByGroup: Record<number, string[]>
}

const initialCreateClassroomState: CreateClassroomSlice = {
  missMatchActionByGroup: {},
  selectedStudentsByGroup: {}
}

export const createClassroomSlice = createSlice({
  name: 'createClassroomSlice',
  initialState: initialCreateClassroomState,
  reducers: {
    setMissMatchAction(state, action: { payload: { groupId: number; action: 'autoAssign' | 'exclude' } }) {
      const { groupId, action: actionValue } = action.payload
      state.missMatchActionByGroup[groupId] = actionValue
    },
    setSelectedStudentsForGroup(state, action: { payload: { groupId: number; studentIds: string[] } }) {
      const { groupId, studentIds } = action.payload
      state.selectedStudentsByGroup[groupId] = studentIds
    },
    clearCreateClassroomState: () => initialCreateClassroomState
  }
})

export const { setMissMatchAction, setSelectedStudentsForGroup, clearCreateClassroomState } =
  createClassroomSlice.actions
