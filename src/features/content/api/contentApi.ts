// src/features/content/api/contentApi.ts

import { Content, ContentQueryParams } from '@/features/content/types/content.type'
import { createCrudApi } from '@/libs/redux/baseApi'

// The original API definition created by createCrudApi
export const contentApi = createCrudApi<Content, ContentQueryParams>({
  reducerPath: 'contentApi',
  tagType: 'Content',
  baseUrl: '/contents'
})

// Export all hooks, including the new ones for FormData
export const {
  useSearchQuery: useSearchContentQuery,
  useGetByIdQuery: useGetContentByIdQuery,
  useGetAllQuery: useGetAllContentQuery,
  useCreateMutation: useCreateContentMutation,
  useUpdateMutation: useUpdateContentMutation,
  useDeleteMutation: useDeleteContentMutation,

  // lazy
  useLazySearchQuery: useLazySearchContentQuery,
  useLazyGetAllQuery: useLazyGetAllContentQuery,
  useLazyGetByIdQuery: useLazyGetContentByIdQuery
} = contentApi
