import { Standard, StandardQueryParams } from '@/features/resource/standard/types/standard.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const standardApi = createCrudApi<Standard, StandardQueryParams>({
  reducerPath: 'standardApi',
  tagTypes: ['Standard'],
  baseUrl: '/standards'
})

export const {
  // queries
  useSearchQuery: useSearchStandardQuery,
  useGetAllQuery: useGetAllStandardQuery,
  useGetByIdQuery: useGetStandardByIdQuery,

  // mutations
  useCreateMutation: useCreateStandardMutation,
  useUpdateMutation: useUpdateStandardMutation,
  useDeleteMutation: useDeleteStandardMutation,

  // lazy
  useLazySearchQuery: useLazySearchStandardQuery,
  useLazyGetAllQuery: useLazyGetAllStandardQuery,
  useLazyGetByIdQuery: useLazyGetStandardByIdQuery
} = standardApi
