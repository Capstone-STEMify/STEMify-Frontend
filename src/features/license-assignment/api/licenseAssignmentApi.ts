import {
  LicenseAssignment,
  LicenseAssignmentCreatePayload,
  LicenseAssignmentSliceParams,
  UploadBulkCsvInvitation
} from '@/features/license-assignment/types/licenseAssignment'
import { createCrudApi } from '@/libs/redux/baseApi'

export const licenseAssignmentApi = createCrudApi<LicenseAssignment, LicenseAssignmentSliceParams>({
  reducerPath: 'licenseAssignmentApi',
  tagTypes: ['LicenseAssignment', 'Subscription'],
  baseUrl: '/license-assignments'
}).injectEndpoints({
  endpoints: (builder) => ({
    createLicenseAssignmentBulk: builder.mutation<
      void,
      { organization_id: string; users: LicenseAssignmentCreatePayload[] }
    >({
      query: ({ organization_id, users }) => ({
        url: `/organizations/${organization_id}/invitations/invite`,
        method: 'POST',
        body: { users }
      }),
      invalidatesTags: ['Subscription', 'LicenseAssignment']
    }),
    uploadCSVBulk: builder.mutation<void, { organization_id: string; body: UploadBulkCsvInvitation }>({
      query: ({ organization_id, body }) => ({
        url: `/organizations/${organization_id}/bulk-invitations/upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Subscription', 'LicenseAssignment']
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
  useLazyGetAllQuery: useLazyGetAllLicenseAssignmentQuery,
  useUploadCSVBulkMutation: useUploadCSVBulkMutation
} = licenseAssignmentApi
