import { CurriculumEnrollmentSliceParams } from '@/features/enrollment/types/enrollment.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: CurriculumEnrollmentSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: ''
}

export const curriculumEnrollmentSlice = createQuerySlice('curriculumEnrollmentSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  curriculumEnrollmentSlice.actions
