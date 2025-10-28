import { OrganizationQueryParams, OrganizationType } from '@/features/organization/types/organization.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const organizationApi = createCrudApi({
  reducerPath: 'organizationApi',
  baseUrl: '/organizations',
  tagTypes: ['Organization']
}).injectEndpoints({
  endpoints: (build) => ({
    getOrganizationTypes: build.query<ApiSuccessResponse<PaginatedResult<OrganizationType>>, OrganizationQueryParams>({
      query: () => '/organization-types',
      providesTags: ['Organization']
    })
  })
})

export const {
  useGetAllQuery: useGetAllOrganizationsQuery,
  useSearchQuery: useSearchOrganizationsQuery,
  useGetByIdQuery: useGetOrganizationByIdQuery,
  useCreateMutation: useCreateOrganizationMutation,
  useUpdateMutation: useUpdateOrganizationMutation,
  useDeleteMutation: useDeleteOrganizationMutation,

  useGetOrganizationTypesQuery
} = organizationApi
