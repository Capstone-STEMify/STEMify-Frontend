import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const lessonApi = createCrudApi<Lesson, LessonQueryParams>({
  reducerPath: 'lessonApi',
  tagTypes: ['Lesson', 'Content', 'LessonAsset', 'LessonAssetTag'],
  baseUrl: '/lessons'
}).injectEndpoints({
  endpoints: (builder) => ({
    updateLessonSectionOrder: builder.mutation<any, { id: number; orderedSectionIds: number[] }>({
      query: ({ id, orderedSectionIds }) => ({
        url: `/lessons/${id}/sections-reorder`,
        method: 'PATCH',
        body: { orderedSectionIds }
      }),
      invalidatesTags: ['Lesson']
    })
  })
})

export const {
  useSearchQuery: useSearchLessonQuery,
  useGetByIdQuery: useGetLessonByIdQuery,
  useGetAllQuery: useGetAllLessonQuery,
  useCreateMutation: useCreateLessonMutation,
  useUpdateMutation: useUpdateLessonMutation,
  useDeleteMutation: useDeleteLessonMutation,
  // lazy
  useLazySearchQuery: useLazySearchLessonQuery,
  useLazyGetAllQuery: useLazyGetAllLessonQuery,
  useLazyGetByIdQuery: useLazyGetLessonByIdQuery,

  useUpdateLessonSectionOrderMutation
} = lessonApi
