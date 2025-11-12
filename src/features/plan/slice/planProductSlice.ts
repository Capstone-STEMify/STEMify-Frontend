import { PlanSliceParams, PlanStatus } from '@/features/plan/types/plan.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: PlanSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: PlanStatus.PUBLISHED
}

export const planSlice = createQuerySlice('planSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } = planSlice.actions
