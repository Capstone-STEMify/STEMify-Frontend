import { createCrudApi } from '@/libs/redux/baseApi'
import { User, UserQueryParams, UserSliceParams } from '../types/user.type'

export const userApi = createCrudApi<User, UserSliceParams>({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  baseUrl: '/users'
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
  useLazyGetByIdQuery: useLazyGetUserByIdQuery
} = userApi
