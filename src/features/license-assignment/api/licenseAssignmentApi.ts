import { LicenseAssignment, LicenseAssignmentSliceParams } from '@/features/license-assignment/types/licenseAssignment'
import { createCrudApi } from '@/libs/redux/baseApi'

export const licenseAssignmentApi = createCrudApi<LicenseAssignment, LicenseAssignmentSliceParams>({
  reducerPath: 'licenseAssignmentApi',
  tagTypes: ['LicenseAssignment'],
  baseUrl: '/license-assignments'
})

export const {
  useGetByIdQuery: useGetLicenseAssignmentByIdQuery,
  useSearchQuery: useSearchLicenseAssignmentQuery,
  useGetAllQuery: useGetAllLicenseAssignmentQuery,
  useCreateMutation: useCreateLicenseAssignmentMutation,
  useUpdateMutation: useUpdateLicenseAssignmentMutation,
  useDeleteMutation: useDeleteLicenseAssignmentMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetLicenseAssignmentByIdQuery,
  useLazySearchQuery: useLazySearchLicenseAssignmentQuery,
  useLazyGetAllQuery: useLazyGetAllLicenseAssignmentQuery
} = licenseAssignmentApi
