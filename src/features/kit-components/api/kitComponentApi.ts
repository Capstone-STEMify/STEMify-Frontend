import { Component, ComponentSliceParams, KitComponent } from '@/features/kit-components/types/kit-component.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const componentApi = createCrudApi<Component, ComponentSliceParams>({
  reducerPath: 'componentApi',
  tagTypes: ['Product', 'Component', 'Kit'],
  baseUrl: '/components'
}).injectEndpoints({
  endpoints: (builder) => ({
    createKitComponents: builder.mutation<void, { kitId: number; components: Partial<KitComponent>[] }>({
      query: ({ kitId, components }) => ({
        url: `/kit-components`,
        method: 'POST',
        body: { kitId, components }
      }),
      invalidatesTags: ['Product', 'Component', 'Kit']
    }),
    updateKitComponents: builder.mutation<void, { components: Partial<KitComponent>[] }>({
      query: ({ components }) => ({
        url: `/kit-components`,
        method: 'PATCH',
        body: { components }
      }),
      invalidatesTags: ['Product', 'Component', 'Kit']
    }),
    deleteKitComponents: builder.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: `/kit-components`,
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: ['Product', 'Component', 'Kit']
    })
  })
})

export const {
  useSearchQuery: useSearchComponentQuery,
  useGetByIdQuery: useGetComponentByIdQuery,
  useGetAllQuery: useGetAllComponentQuery,
  useCreateMutation: useCreateComponentMutation,
  useUpdateMutation: useUpdateComponentMutation,
  useDeleteMutation: useDeleteComponentMutation,
  useCreateKitComponentsMutation,
  useUpdateKitComponentsMutation,
  useDeleteKitComponentsMutation,

  // lazy
  useLazySearchQuery: useLazySearchComponentQuery,
  useLazyGetAllQuery: useLazyGetAllComponentQuery,
  useLazyGetByIdQuery: useLazyGetComponentByIdQuery
} = componentApi
