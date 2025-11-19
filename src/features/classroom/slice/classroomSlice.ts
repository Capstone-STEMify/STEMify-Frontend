import { ClassroomSliceParams, ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: ClassroomSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  status: undefined
}

export const classroomSlice = createQuerySlice('classroomSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  classroomSlice.actions
