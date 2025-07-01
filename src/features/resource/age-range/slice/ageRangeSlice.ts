import { AgeRangeSliceParams } from '@/features/resource/age-range/types/ageRange.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: AgeRangeSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const ageRangeSlice = createQuerySlice('ageRangeSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  ageRangeSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
