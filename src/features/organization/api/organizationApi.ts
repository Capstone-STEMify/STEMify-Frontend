import {
  Organization,
  OrganizationQueryParams,
  OrganizationSliceParams,
  OrganizationType
} from '@/features/organization/types/organization.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const organizationApi = createCrudApi<Organization, OrganizationSliceParams>({
  reducerPath: 'organizationApi',
  baseUrl: '/organizations',
  tagTypes: ['Organization']
}).injectEndpoints({
  endpoints: (build) => ({
    getAllOrganizationTypes: build.query<
      ApiSuccessResponse<PaginatedResult<OrganizationType>>,
      OrganizationSliceParams
    >({
      query: () => '/organization-types',
      providesTags: ['Organization']
    })
  })
})

export const {
  // Org
  useGetAllQuery: useGetAllOrganizationsQuery,
  useSearchQuery: useSearchOrganizationsQuery,
  useGetByIdQuery: useGetOrganizationByIdQuery,
  useCreateMutation: useCreateOrganizationMutation,
  useUpdateMutation: useUpdateOrganizationMutation,
  useDeleteMutation: useDeleteOrganizationMutation,

  // Org types
  useGetAllOrganizationTypesQuery
} = organizationApi
