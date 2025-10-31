import { OrganizationSliceParams } from '@/features/organization/types/organization.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: OrganizationSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: undefined
}

export const organizationSlice = createQuerySlice('organizationSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  organizationSlice.actions
