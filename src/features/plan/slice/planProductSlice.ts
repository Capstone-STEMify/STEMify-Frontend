import { PlanSliceParams } from '@/features/plan/types/plan.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: PlanSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const planProductSlice = createQuerySlice('planProductSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  planProductSlice.actions
