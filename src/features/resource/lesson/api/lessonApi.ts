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

export const { useCreateLessonWithFormDataMutation } = lessonApiExtended
