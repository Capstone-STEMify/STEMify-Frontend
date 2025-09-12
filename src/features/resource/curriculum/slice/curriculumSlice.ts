import { createQuerySlice } from '@/libs/redux/createQuerySlice'
import { CurriculumSliceParams, CurriculumStatus } from '../types/curriculum.type'

const initialState: CurriculumSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  curriculumId: undefined
}

export const curriculumSlice = createQuerySlice('curriculumSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  curriculumSlice.actions
