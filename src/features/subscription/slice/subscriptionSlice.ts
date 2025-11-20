import { OrganizationSubscriptionSliceParams } from '@/features/subscription/types/subscription.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: OrganizationSubscriptionSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: undefined
}

export const organizationSubscriptionSlice = createQuerySlice('organizationSubscriptionSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  organizationSubscriptionSlice.actions
