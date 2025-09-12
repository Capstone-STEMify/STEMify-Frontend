import { AgeRange, AgeRangeQueryParams } from '@/features/resource/age-range/types/ageRange.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const ageRangeApi = createCrudApi<AgeRange, AgeRangeQueryParams>({
  reducerPath: 'ageRangeApi',
  tagTypes: ['AgeRange'],
  baseUrl: '/ageranges'
})

export const {
  // queries
  useSearchQuery: useSearchAgeRangeQuery,
  useGetAllQuery: useGetAllAgeRangeQuery,
  useGetByIdQuery: useGetAgeRangeByIdQuery,

  // mutations
  useCreateMutation: useCreateAgeRangeMutation,
  useUpdateMutation: useUpdateAgeRangeMutation,
  useDeleteMutation: useDeleteAgeRangeMutation,

  // lazy
  useLazySearchQuery: useLazySearchAgeRangeQuery,
  useLazyGetAllQuery: useLazyGetAllAgeRangeQuery,
  useLazyGetByIdQuery: useLazyGetAgeRangeByIdQuery
} = ageRangeApi
