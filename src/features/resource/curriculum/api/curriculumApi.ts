import { createCrudApi } from '@/libs/redux/baseApi'
import { Curriculum, CurriculumQueryParams } from '../types/curriculum.type'

export const curriculumApi = createCrudApi<Curriculum, CurriculumQueryParams>({
  reducerPath: 'curriculumApi',
  tagType: 'Curriculum',
  baseUrl: '/curriculums'
})

export const {
  useSearchQuery: useSearchCurriculumQuery,
  useGetByIdQuery: useGetCurriculumByIdQuery,
  useGetAllQuery: useGetAllCurriculumQuery,
  useCreateMutation: useCreateCurriculumMutation,
  useUpdateMutation: useUpdateCurriculumMutation,
  useDeleteMutation: useDeleteCurriculumMutation,

  // lazy
  useLazySearchQuery: useLazySearchCurriculumQuery,
  useLazyGetAllQuery: useLazyGetAllCurriculumQuery,
  useLazyGetByIdQuery: useLazyGetCurriculumByIdQuery
} = curriculumApi
