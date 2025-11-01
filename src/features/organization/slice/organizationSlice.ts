import { OrganizationSliceParams, OrganizationStatus } from '@/features/organization/types/organization.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: OrganizationSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: OrganizationStatus.ACTIVE
}

export const organizationSlice = createQuerySlice('organizationSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  organizationSlice.actions
