import { CourseSliceParams } from '@/features/resource/course/types/course.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: CourseSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const courseSlice = createQuerySlice('courseSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  courseSlice.actions
