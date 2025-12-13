import { Group, GroupQueryParams } from '@/features/group/types/group.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const groupApi = createCrudApi<Group, GroupQueryParams>({
  reducerPath: 'groupApi',
  tagTypes: ['Group'],
  baseUrl: '/groups'
}).injectEndpoints({
  endpoints: (builder) => ({
    searchGroupByOrganizationId: builder.query<
      ApiSuccessResponse<PaginatedResult<Group>>,
      { organizationId: number; params: GroupQueryParams }
    >({
      query: ({ organizationId, params }) => ({
        url: `/organizations/${organizationId}/groups`,
        method: 'GET',
        params
      }),
      providesTags: ['Group']
    }),

    addStudentToGroup: builder.mutation<
      ApiSuccessResponse<{ isSuccess: boolean }>,
      { groupId: number; studentIds: string[] }
    >({
      query: ({ groupId, studentIds }) => ({
        url: `/groups/${groupId}/students`,
        method: 'POST',
        body: { studentIds }
      }),
      invalidatesTags: ['Group']
    }),

    removeStudentFromGroup: builder.mutation<
      ApiSuccessResponse<{ isSuccess: boolean }>,
      { groupId: number; studentIds: string[] }
    >({
      query: ({ groupId, studentIds }) => ({
        url: `/groups/${groupId}/students`,
        method: 'DELETE',
        body: { studentIds }
      }),
      invalidatesTags: ['Group']
    })
  })
})

export const {
  useGetAllQuery: useGetAllGroupsQuery,
  useSearchQuery: useSearchGroupsQuery,
  useGetByIdQuery: useGetGroupByIdQuery,

  useUpdateMutation: useUpdateGroupMutation,
  useDeleteMutation: useDeleteGroupMutation,
  useCreateMutation: useCreateGroupMutation,

  useSearchGroupByOrganizationIdQuery,
  useAddStudentToGroupMutation,
  useRemoveStudentFromGroupMutation
} = groupApi
