import { createQuerySlice } from '@/libs/redux/createQuerySlice'
import { UserSliceParams } from '../types/user.type'

const initialState: UserSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: '',
  subscription_order_id: undefined,
  license_type: undefined
}

export const userSlice = createQuerySlice('userSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } = userSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
