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
      ApiSuccessResponse<{ curriculums: OrganizationCurriculum[] }>,
      { organizationId: number; status?: string }
    >({
      query: ({ organizationId, status }) => ({
        url: `/organizations/${organizationId}/curriculums`,
        params: status ? { status } : undefined
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
