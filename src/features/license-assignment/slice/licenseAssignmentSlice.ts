import {
  LicenseAssignmentSliceParams,
  LicenseAssignmentStatus
} from '@/features/license-assignment/types/licenseAssignment'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: LicenseAssignmentSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  orderBy: '',
  status: LicenseAssignmentStatus.ACTIVE,
  type: undefined,
  organizationSubscriptionOrderId: undefined,
  userId: undefined
}

export const licenseAssignmentSlice = createQuerySlice('licenseAssignmentSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  licenseAssignmentSlice.actions
