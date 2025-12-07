import { GroupSliceParams } from '@/features/group/types/group.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: GroupSliceParams = {
  pageNumber: 1,
  pageSize: 20,
  search: '',
  orderBy: '',
  status: ''
}

export const groupSlice = createQuerySlice('groupSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } = groupSlice.actions
