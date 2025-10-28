import {
  Organization,
  OrganizationQueryParams,
  OrganizationType
} from '@/features/organization/types/organization.type'
import { Plan } from '@/features/plan/types/plan.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const organizationApi = createCrudApi<Organization, OrganizationQueryParams>({
  reducerPath: 'organizationApi',
  baseUrl: '/organizations',
  tagTypes: ['Organization']
}).injectEndpoints({
  endpoints: (build) => ({
    getAllOrganizationTypes: build.query<
      ApiSuccessResponse<PaginatedResult<OrganizationType>>,
      OrganizationQueryParams
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
