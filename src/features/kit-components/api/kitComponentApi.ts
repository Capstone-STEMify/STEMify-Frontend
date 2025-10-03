import { Component, ComponentSliceParams } from '@/features/kit-components/types/kit-component.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const componentApi = createCrudApi<Component, ComponentSliceParams>({
  reducerPath: 'componentApi',
  tagTypes: ['Component'],
  baseUrl: '/components'
})

export const {
  useSearchQuery: useSearchComponentQuery,
  useGetByIdQuery: useGetComponentByIdQuery,
  useGetAllQuery: useGetAllComponentQuery,
  useCreateMutation: useCreateComponentMutation,
  useUpdateMutation: useUpdateComponentMutation,
  useDeleteMutation: useDeleteComponentMutation,

  // lazy
  useLazySearchQuery: useLazySearchComponentQuery,
  useLazyGetAllQuery: useLazyGetAllComponentQuery,
  useLazyGetByIdQuery: useLazyGetComponentByIdQuery
} = componentApi
