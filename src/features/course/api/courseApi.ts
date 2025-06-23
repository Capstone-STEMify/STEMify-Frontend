import { injectCrudEndpoints } from '@/libs/redux/injectCrudEndpoints'
import { Course, CourseParams } from '../types/course'

export const courseApi = injectCrudEndpoints<Course, CourseParams>({
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
