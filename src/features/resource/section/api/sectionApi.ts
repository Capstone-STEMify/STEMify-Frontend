import { Section, SectionQueryParams } from '@/features/resource/section/types/section.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const sectionApi = createCrudApi<Section, SectionQueryParams>({
  reducerPath: 'sectionApi',
  tagType: 'Section',
  baseUrl: '/sections'
})

export const {
  useSearchQuery: useSearchSectionQuery,
  useGetByIdQuery: useGetSectionByIdQuery,
  useGetAllQuery: useGetAllSectionQuery,
  useCreateMutation: useCreateSectionMutation,
  useUpdateMutation: useUpdateSectionMutation,
  useDeleteMutation: useDeleteSectionMutation,

  // lazy
  useLazySearchQuery: useLazySearchSectionQuery,
  useLazyGetAllQuery: useLazyGetAllSectionQuery,
  useLazyGetByIdQuery: useLazyGetSectionByIdQuery
} = sectionApi
