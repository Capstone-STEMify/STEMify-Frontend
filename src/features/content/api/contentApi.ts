import { Content, ContentQueryParams } from '@/features/content/types/content.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const contentApi = createCrudApi<Content, ContentQueryParams>({
  reducerPath: 'contentApi',
  tagType: 'Content',
  baseUrl: '/contents'
})

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
