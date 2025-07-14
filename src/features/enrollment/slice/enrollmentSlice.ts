import { EnrollmentSliceParams } from '@/features/enrollment/types/enrollment.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: EnrollmentSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const enrollmentSlice = createQuerySlice('enrollmentSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  enrollmentSlice.actions
