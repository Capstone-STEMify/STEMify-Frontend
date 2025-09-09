import { Category, CategoryQueryParams } from '@/features/resource/category/types/category.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const categoryApi = createCrudApi<Category, CategoryQueryParams>({
  reducerPath: 'categoryApi',
  tagTypes: ['Category'],
  baseUrl: '/categories'
})

export const {
  // queries
  useSearchQuery: useSearchCategoryQuery,
  useGetAllQuery: useGetAllCategoryQuery,
  useGetByIdQuery: useGetCategoryByIdQuery,

  // mutations
  useCreateMutation: useCreateCategoryMutation,
  useUpdateMutation: useUpdateCategoryMutation,
  useDeleteMutation: useDeleteCategoryMutation,

  // lazy
  useLazySearchQuery: useLazySearchCategoryQuery,
  useLazyGetAllQuery: useLazyGetAllCategoryQuery,
  useLazyGetByIdQuery: useLazyGetCategoryByIdQuery
} = categoryApi
