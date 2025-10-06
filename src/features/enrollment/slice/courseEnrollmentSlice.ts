import { CourseEnrollmentSliceParams } from '@/features/enrollment/types/enrollment.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: CourseEnrollmentSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: ''
}

export const courseEnrollmentSlice = createQuerySlice('courseEnrollmentSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  courseEnrollmentSlice.actions
