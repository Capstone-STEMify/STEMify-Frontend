import { createCrudApi } from '@/libs/redux/baseApi'
import { Course, CourseQueryParams } from '../types/course.type'

export const courseApi = createCrudApi<Course, CourseQueryParams>({
  reducerPath: 'courseApi',
  tagType: 'Course',
  baseUrl: '/courses'
})

export const {
  useSearchQuery: useSearchCourseQuery,
  useGetByIdQuery: useGetCourseByIdQuery,
  useGetAllQuery: useGetAllCourseQuery,
  useCreateMutation: useCreateCourseMutation,
  useCreateFormDataMutation: useCreateCourseWithFormDataMutation,
  useUpdateMutation: useUpdateCourseMutation,
  useUpdateFormDataMutation: useUpdateCourseWithFormDataMutation,
  useDeleteMutation: useDeleteCourseMutation,

  // lazy
  useLazySearchQuery: useLazySearchCourseQuery,
  useLazyGetAllQuery: useLazyGetAllCourseQuery,
  useLazyGetByIdQuery: useLazyGetCourseByIdQuery
} = courseApi

// export const { useCreateCourseWithFormDataMutation } = courseApiExtended
