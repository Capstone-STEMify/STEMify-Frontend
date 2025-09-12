import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: KitSliceParams = {
  pageNumber: 1,
  pageSize: 8,
  search: '',
  orderBy: '',
  status: ''
}

export const kitSlice = createQuerySlice('kitSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } = kitSlice.actions
