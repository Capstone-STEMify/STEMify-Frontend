import {
  Organization,
  OrganizationCurriculum,
  OrganizationQueryParams,
  OrganizationSliceParams,
  OrganizationType
} from '@/features/organization/types/organization.type'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const organizationApi = createCrudApi<Organization, OrganizationSliceParams>({
  reducerPath: 'organizationApi',
  baseUrl: '/organizations',
  tagTypes: ['Subscription', 'Organization']
}).injectEndpoints({
  endpoints: (build) => ({
    getAllOrganizationTypes: build.query<
      ApiSuccessResponse<PaginatedResult<OrganizationType>>,
      OrganizationSliceParams
    >({
      query: () => '/organization-types',
      providesTags: ['Organization']
    }),
    getCurriculumsByOrganizationId: build.query<
      ApiSuccessResponse<{ curriculums: Curriculum[] }>,
      { organizationId: number }
    >({
      query: ({ organizationId }) => ({
        url: `/organizations/${organizationId}/curriculums`
      }),
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
  useGetAllOrganizationTypesQuery,

  // Org Curriculums
  useGetCurriculumsByOrganizationIdQuery
} = organizationApi
