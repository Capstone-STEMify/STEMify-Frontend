import { createCrudApi } from '@/libs/redux/baseApi'
import { User, UserQueryParams, UserSliceParams } from '../types/user.type'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'

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
  useSearchUserV2Query
} = userApi
