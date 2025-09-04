import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const lessonApi = createCrudApi<Lesson, LessonQueryParams>({
  reducerPath: 'lessonApi',
  tagTypes: ['Lesson', 'Content'],
  baseUrl: '/lessons'
})

export const lessonApiExtended = lessonApi.injectEndpoints({
  endpoints: (builder) => ({
    updateLessonSectionOrder: builder.mutation<any, { id: number; body: { orderedSectionIds: number[] } }>({
      query: ({ id, body }) => ({
        url: `/lessons/${id}/sections-reorder`,
        method: 'PATCH',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
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
  useLazyGetByIdQuery: useLazyGetLessonByIdQuery
} = lessonApi

export const { useUpdateLessonSectionOrderMutation } = lessonApiExtended
