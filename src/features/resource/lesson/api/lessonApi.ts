import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const lessonApi = createCrudApi<Lesson, LessonQueryParams>({
  reducerPath: 'lessonApi',
  tagType: 'Lesson',
  baseUrl: '/lessons'
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
