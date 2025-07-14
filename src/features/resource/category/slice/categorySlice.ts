import { CategorySliceParams } from '@/features/resource/category/types/category.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: CategorySliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const categorySlice = createQuerySlice('categorySlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  categorySlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
