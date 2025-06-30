import { StandardSliceParams } from '@/features/resource/standard/types/standard.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: StandardSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const standardSlice = createQuerySlice('standardSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  standardSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
