import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const lessonApi = createCrudApi<Lesson, LessonQueryParams>({
  reducerPath: 'lessonApi',
  tagType: 'Lesson',
  baseUrl: '/lessons'
})

export const lessonApiExtended = lessonApi.injectEndpoints({
  endpoints: (builder) => ({
    createLessonWithFormData: builder.mutation<Lesson, FormData>({
      query: (formData) => ({
        url: '/lessons',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Lesson']
    }),
    updateLessonWithFormData: builder.mutation<Lesson, { id: string | number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/lessons/${id}`,
        method: 'PATCH',
        body: formData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lesson', id }, 'Lesson']
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

export const { useCreateLessonWithFormDataMutation, useUpdateLessonWithFormDataMutation } = lessonApiExtended
