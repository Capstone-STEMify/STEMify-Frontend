import { Category, CategoryQueryParams } from '@/features/resource/category/types/category.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const categoryApi = createCrudApi<Category, CategoryQueryParams>({
  reducerPath: 'categoryApi',
  tagType: 'Category',
  baseUrl: '/categories'
})

export const {
  // queries
  useSearchQuery: useSearchCategoryQuery,
  useGetAllQuery: useGetAllCategoryQuery,
  useGetByIdQuery: useGetCategoryByIdQuery,

  // mutations
  useCreateMutation: useCreateCategoryMutaion,
  useUpdateMutation: useUpdateCategoryMutation,
  useDeleteMutation: useDeleteCategoryMutation,

  // lazy
  useLazySearchQuery: useLazySearchCategoryQuery,
  useLazyGetAllQuery: useLazyGetAllCategoryQuery,
  useLazyGetByIdQuery: useLazyGetCategoryByIdQuery
} = categoryApi
