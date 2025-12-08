import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import {
  OrganizationUser,
  OrganizationUserQueryParams,
  User,
  UserQueryParams,
  UserSliceParams
} from '@/features/user/types/user.type'

export const userApi = createCrudApi<User, UserSliceParams>({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  baseUrl: '/users'
}).injectEndpoints({
  endpoints: (builder) => ({
    // search users by organization subscription id and license type
    searchUserV2: builder.query<ApiSuccessResponse<PaginatedResult<User>>, UserSliceParams>({
      query: (userSliceParams) => ({
        url: `/users/search`,
        method: 'GET',
        params: userSliceParams
      })
    }),

    // Organization User APIs
    getOrganizationUser: builder.query<
      ApiSuccessResponse<PaginatedResult<OrganizationUser>>,
      OrganizationUserQueryParams
    >({
      query: ({ organizationId, pageNumber, pageSize, role, email }) => ({
        url: `/organizations/${organizationId}/users`,
        method: 'GET',
        params: { pageNumber, pageSize, role, email }
      }),
      providesTags: ['User']
    })
  })
})

export const {
  useSearchQuery: useSearchUserQuery,
  useGetAllQuery: useGetAllUserQuery,
  useGetByIdQuery: useGetUserByIdQuery,

  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useDeleteMutation: useDeleteUserMutation,

  useLazySearchQuery: useLazySearchUserQuery,
  useLazyGetAllQuery: useLazyGetAllUserQuery,
  useLazyGetByIdQuery: useLazyGetUserByIdQuery,
  useSearchUserV2Query,

  useGetOrganizationUserQuery
} = userApi
