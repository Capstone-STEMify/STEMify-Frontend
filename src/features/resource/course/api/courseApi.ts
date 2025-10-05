import { createCrudApi } from '@/libs/redux/baseApi'
import { Course, CourseQueryParams } from '../types/course.type'

export const courseApi = createCrudApi<Course, CourseQueryParams>({
  reducerPath: 'courseApi',
  tagTypes: ['Course', 'Kit', 'Component', 'Product'],
  baseUrl: '/courses'
}).injectEndpoints({
  endpoints: (builder) => ({
    updateLessonOrder: builder.mutation<void, { id: number; orderedLessonIds: number[] }>({
      query: ({ id, orderedLessonIds }) => ({
        url: `/courses/${id}/lessons-reorder`,
        method: 'PATCH',
        body: { orderedLessonIds }
      })
    })
  })
})

export const {
  useSearchQuery: useSearchCourseQuery,
  useGetByIdQuery: useGetCourseByIdQuery,
  useGetAllQuery: useGetAllCourseQuery,
  useCreateMutation: useCreateCourseMutation,
  useUpdateMutation: useUpdateCourseMutation,
  useDeleteMutation: useDeleteCourseMutation,
  useUpdateLessonOrderMutation: useUpdateLessonOrderMutation,

  // lazy
  useLazySearchQuery: useLazySearchCourseQuery,
  useLazyGetAllQuery: useLazyGetAllCourseQuery,
  useLazyGetByIdQuery: useLazyGetCourseByIdQuery
} = courseApi
