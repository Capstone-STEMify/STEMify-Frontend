// src/features/content/api/contentApi.ts

import { Content, ContentQueryParams } from '@/features/content/types/content.type'
import { createCrudApi } from '@/libs/redux/baseApi'

// The original API definition created by createCrudApi
export const contentApi = createCrudApi<Content, ContentQueryParams>({
  reducerPath: 'contentApi',
  tagType: 'Content',
  baseUrl: '/contents'
}).injectEndpoints({
  // We inject new endpoints specifically for handling FormData
  endpoints: (builder) => ({
    createContentWithFormData: builder.mutation<Content, FormData>({
      query: (formData) => ({
        url: '/contents',
        method: 'POST',
        body: formData,
        // The 'Content-Type' header is automatically set to 'multipart/form-data' by RTK Query
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }]
    }),
    updateContentWithFormData: builder.mutation<Content, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/contents/${id}`,
        method: 'PATCH', // Or 'PUT' depending on your API
        body: formData
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Content', id }]
    })
  })
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
  useLazyGetByIdQuery: useLazyGetContentByIdQuery,

  // New hooks for FormData
  useCreateContentWithFormDataMutation,
  useUpdateContentWithFormDataMutation
} = contentApi