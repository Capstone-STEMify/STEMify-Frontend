import { Group, GroupQueryParams } from '@/features/group/types/group.type'
import { userApi } from '@/features/user/api/userApi'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const groupApi = createCrudApi<Group, GroupQueryParams>({
  reducerPath: 'groupApi',
  tagTypes: ['Group', 'UngroupedStudent', 'OrganizationUser'],
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
      providesTags: ['Group', 'OrganizationUser']
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
      invalidatesTags: ['Group', 'OrganizationUser']
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
      invalidatesTags: ['Group', 'OrganizationUser']
    }),

    createOrganizationGroup: builder.mutation<
      ApiSuccessResponse<Group>,
      { organizationId: number; groupData: Partial<Group> }
    >({
      query: ({ organizationId, groupData }) => ({
        url: `/organizations/${organizationId}/groups/with-students`,
        method: 'POST',
        body: groupData
      }),
      invalidatesTags: ['Group'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(userApi.util.invalidateTags([{ type: 'UngroupedStudent', id: 'LIST' }]))
        } catch {}
      }
    })
  })
})

export const {
  useGetAllQuery: useGetAllGroupsQuery,
  useSearchQuery: useSearchGroupsQuery,
  useGetByIdQuery: useGetGroupByIdQuery,

  useUpdateMutation: useUpdateGroupMutation,
  useDeleteMutation: useDeleteGroupMutation,

  useSearchGroupByOrganizationIdQuery,
  useAddStudentToGroupMutation,
  useRemoveStudentFromGroupMutation,
  useCreateOrganizationGroupMutation
} = groupApi
