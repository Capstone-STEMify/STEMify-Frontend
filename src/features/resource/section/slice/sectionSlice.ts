import { SectionSliceParams } from '@/features/resource/section/types/section.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: SectionSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const sectionSlice = createQuerySlice('sectionSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  sectionSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
