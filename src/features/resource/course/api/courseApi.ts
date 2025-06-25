import { createCrudApi } from '@/libs/redux/baseApi'
import { Course, CourseParams } from '../types/course.type'

export const courseApi = createCrudApi<Course, CourseParams>({
  reducerPath: 'courseApi',
  tagType: 'Course',
  baseUrl: '/courses'

  // searchUrl: '/courses/search'
})

export const {
  useSearchQuery: useSearchCourseQuery,
  useGetByIdQuery: useGetCourseByIdQuery,
  useGetAllQuery: useGetAllCourseQuery,
  useCreateMutation: useCreateCourseMutation,
  useUpdateMutation: useUpdateCourseMutation,
  useDeleteMutation: useDeleteCourseMutation,

  // lazy
  useLazySearchQuery: useLazySearchCourseQuery,
  useLazyGetAllQuery: useLazyGetAllCourseQuery,
  useLazyGetByIdQuery: useLazyGetCourseByIdQuery
} = courseApi
