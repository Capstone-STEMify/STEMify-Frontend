import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: KitSliceParams = {
  pageNumber: 1,
  pageSize: 8,
  search: undefined,
  orderBy: undefined,
  status: undefined,
  sortDirection: 'Asc',
  minPrice: undefined,
  maxPrice: undefined,
  ageRangeId: undefined
}

export const kitProductSlice = createQuerySlice('kitProductSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams, setSortDirection } =
  kitProductSlice.actions
