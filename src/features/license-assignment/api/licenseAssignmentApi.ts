import {
  LicenseAssignment,
  LicenseAssignmentCreatePayload,
  LicenseAssignmentSliceParams
} from '@/features/license-assignment/types/licenseAssignment'
import { createCrudApi } from '@/libs/redux/baseApi'

export const licenseAssignmentApi = createCrudApi<LicenseAssignment, LicenseAssignmentSliceParams>({
  reducerPath: 'licenseAssignmentApi',
  tagTypes: ['LicenseAssignment'],
  baseUrl: '/license-assignments'
}).injectEndpoints({
  endpoints: (builder) => ({
    createLicenseAssignmentBulk: builder.mutation<void, { body: LicenseAssignmentCreatePayload[] }>({
      query: ({ body }) => ({
        url: `/license-assignments/bulk`,
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useGetByIdQuery: useGetLicenseAssignmentByIdQuery,
  useSearchQuery: useSearchLicenseAssignmentQuery,
  useGetAllQuery: useGetAllLicenseAssignmentQuery,
  useCreateMutation: useCreateLicenseAssignmentMutation,
  useUpdateMutation: useUpdateLicenseAssignmentMutation,
  useDeleteMutation: useDeleteLicenseAssignmentMutation,
  useCreateLicenseAssignmentBulkMutation,

  // lazy
  useLazyGetByIdQuery: useLazyGetLicenseAssignmentByIdQuery,
  useLazySearchQuery: useLazySearchLicenseAssignmentQuery,
  useLazyGetAllQuery: useLazyGetAllLicenseAssignmentQuery
} = licenseAssignmentApi
